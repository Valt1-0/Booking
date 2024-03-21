exports.registerUser = async (req, res, next) => {
  const { firstname, lastname, email, phone, role, password } = req.body;

  const isNewUser = await User.emailAlreadyUse(email);
  if (!isNewUser)
    return res.status(409).send("User Already Exist. Please Login");

  const user = await User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    phone: phone,
    role: role,
    password: password,
  });

  await user.save();

  const userInfo = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    role: user.role,
    password: user.password,
  };

  res.status(200).json(userInfo);
  return next();
};


exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("No account exists with this email!");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).send("Email/password does not match!");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const userInfo = {
      id: user._id,
      pseudo: user.pseudo,
      email: user.email,
      role: user.role,
    };

    // Supprimer le token précédent de l'en-tête de la réponse s'il existe
    res.removeHeader("Authorization");
    // Ajouter le token dans l'en-tête de la réponse
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(200).json({ user: userInfo, token });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).send("Internal server error!");
  }
};