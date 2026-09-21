import bcryptjs from 'bcryptjs';
import User from '../models/User.model.js';
import { generarJWT } from '../helpers/generar-jwt.js';

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar si el email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - correo',
      });
    }

    // 2. Verificar si el usuario está activo (si manejas el campo "estado")
    if (user.estado === 0 || user.estado === false) {
      return res.status(400).json({
        message: 'Usuario inactivo',
      });
    }

    // 3. Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - password',
      });
    }

    // 4. Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor, hable con el WebMaster',
    });
  }
};

// Crear usuario (encriptando la contraseña antes de guardar)
export const createUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const user = new User({ ...rest, password });

    // Encriptar la contraseña si viene en el body
    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      user.password = bcryptjs.hashSync(password, salt);
    }

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...resto } = req.body;

    // Si se envía una contraseña para actualizar, re-encriptarla
    if (password) {
      const salt = bcryptjs.genSaltSync(10);
      resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, resto, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};