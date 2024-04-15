const amqplib = require("amqplib");
const {
  EXCHANGE_NAME,
  MSG_QUEUE_URL,
  NOTIFICATION_SERVICE,
} = require("../config");

module.exports.FormateData = (data) => {
  if (!data) {
    return { msg: "Internal Server Error", statusCode: 500 };
  }
  const token = data.token;
  const statusCode = data.statusCode || (data ? 200 : 404);

  const responseData = data.msg ? { msg: data.msg } : data.data;

  const otherData = {};

  // Parcourir toutes les propriétés de data
  for (let key in data) {
    // Si la propriété n'est pas data, msg, token ou statusCode, l'ajouter à otherData
    if (key !== "data" && key !== "msg" && key !== "statusCode") {
      otherData[key] = data[key];
    }
  }

  return { data: responseData, statusCode, otherData };
};

module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg), {
    persistent: true,
  });
  console.log("Sent: ", msg);
};

module.exports.SubscribeMessage = async (channel, service) => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue(NOTIFICATION_SERVICE, {
    durable: true,
  });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, NOTIFICATION_SERVICE);

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
