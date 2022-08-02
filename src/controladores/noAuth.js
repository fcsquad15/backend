const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const noAuthSchema = require("../Validações/noAuthSchema");
const noAuthModel = require("../Models/noAuthModel");

const messageError = require("../Mensagens/errorToast");
const messageSuccess = require("../Mensagens/successToast");

const jwtSecret = process.env.TOKEN_SECRET;
const supabase = require("../supabase/supabase")

const signUpUser = async (req, res) => {
  let { nome, email, senha, avatar, bio, area } = req.body;
  const avatarName = nome.replace(" ", "_")
  try {
    await noAuthSchema.signUpUser.validate(req.body);
    const emailExists = await noAuthModel.emailExists(email);
    if (emailExists) {
      return res.status(400).json(messageError.userExists);
    }

    const encryptedPassword = await bcrypt.hash(senha.trim(), 10);

    if (avatar) {
      const buffer = Buffer.from(avatar, 'base64');

      const { data, error } = await supabase
        .storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(`FCamara/${avatarName}.jpeg`, buffer)

      if (error) {
        return res.status(400).json(error.message)
      }

      const { publicURL, error: errorPublicURL } = supabase
        .storage
        .from(process.env.SUPABASE_BUCKET)
        .getPublicUrl(`FCamara/${avatarName}.jpeg`)

      if (errorPublicURL) {
        return res.status(400).json(error.message)
      }
      avatar = publicURL
    }

    const addedUser = await noAuthModel.insertUser(
      nome,
      email,
      encryptedPassword,
      avatar,
      bio,
      area
    );
    if (!addedUser.length) {
      return res.status(400).json(messageError.userSignupFailed);
    }

    return res.status(201).json(messageSuccess.userSignupSucceeded);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    await noAuthSchema.loginSchema.validate({ email, senha });
    const user = await noAuthModel.userEmail(email);
    if (!user) {
      return res.status(404).json(messageError.loginError);
    }

    const validatePassword = await bcrypt.compare(senha, user.senha);
    if (!validatePassword) {
      return res.status(400).json(messageError.loginError);
    }
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "2h" });

    const { senha: _, ...userData } = user;

    return res.status(200).json({
      userData: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  signUpUser,
  login,
};
