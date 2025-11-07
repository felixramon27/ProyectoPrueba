const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria (simulación)
let users = [];
let currentId = 1;

// Validaciones
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
  const domain = email.split('@')[1];
  return domain === 'gmail.com' || domain === 'hotmail.com';
};

const validateDate = (day, month, year) => {
  const d = parseInt(day);
  const m = parseInt(month);
  const y = parseInt(year);
  
  // Validaciones básicas
  if (d < 1 || d > 31 || m < 1 || m > 12 || y > new Date().getFullYear()) {
    return false;
  }
  
  // Validar febrero y años bisiestos
  const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  return d <= daysInMonth[m - 1];
};

const validateName = (name) => {
  return name.length >= 3 && name.length <= 200;
};

const validateCategory = (category) => {
  return ['amigo', 'compañero', 'superAmigos', 'bloqueados'].includes(category);
};

// Endpoints

// Obtener usuarios con paginación y filtros
app.get('/api/users', (req, res) => {
  const { page = 1, limit = 5, category, sortBy = 'nombre', order = 'asc' } = req.query;
  
  let filteredUsers = [...users];
  
  // Filtrar por categoría
  if (category) {
    filteredUsers = filteredUsers.filter(user => user.categoria === category);
  }
  
  // Ordenar
  filteredUsers.sort((a, b) => {
    if (sortBy === 'fechaDeNacimiento') {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return order === 'asc' 
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    }
  });
  
  // Paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    users: paginatedUsers,
    total: filteredUsers.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredUsers.length / limit)
  });
});

// Obtener usuario por ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(user);
});

// Crear usuario
app.post('/api/users', (req, res) => {
  // Validar campos extra
  const allowedFields = ['nombre', 'email', 'fechaDeNacimiento', 'categoria'];
  const receivedFields = Object.keys(req.body);
  const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
  
  if (extraFields.length > 0) {
    return res.status(400).json({ 
      error: `Campos no permitidos: ${extraFields.join(', ')}` 
    });
  }
  
  const { nombre, email, fechaDeNacimiento, categoria } = req.body;
  
  // Validaciones
  if (!validateName(nombre)) {
    return res.status(400).json({ 
      error: 'El nombre debe tener entre 3 y 200 caracteres' 
    });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      error: 'Email no válido. Solo se aceptan emails de gmail y hotmail' 
    });
  }
  
  // Verificar email único
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ 
      error: 'El email ya está en uso' 
    });
  }
  
  if (!validateCategory(categoria)) {
    return res.status(400).json({ 
      error: 'Categoría no válida' 
    });
  }
  
  const newUser = {
    id: currentId++,
    nombre,
    email,
    fechaDeNacimiento: new Date(fechaDeNacimiento).toISOString(),
    categoria
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Actualizar usuario
app.put('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  // Validar campos extra
  const allowedFields = ['nombre', 'email', 'fechaDeNacimiento', 'categoria'];
  const receivedFields = Object.keys(req.body);
  const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
  
  if (extraFields.length > 0) {
    return res.status(400).json({ 
      error: `Campos no permitidos: ${extraFields.join(', ')}` 
    });
  }
  
  const { nombre, email, fechaDeNacimiento, categoria } = req.body;
  
  // Validaciones
  if (nombre && !validateName(nombre)) {
    return res.status(400).json({ 
      error: 'El nombre debe tener entre 3 y 200 caracteres' 
    });
  }
  
  if (email) {
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Email no válido. Solo se aceptan emails de gmail y hotmail' 
      });
    }
    
    // Verificar email único (excluyendo el usuario actual)
    if (users.some(user => user.email === email && user.id !== userId)) {
      return res.status(400).json({ 
        error: 'El email ya está en uso' 
      });
    }
  }
  
  if (categoria && !validateCategory(categoria)) {
    return res.status(400).json({ 
      error: 'Categoría no válida' 
    });
  }
  
  // Actualizar usuario
  users[userIndex] = {
    ...users[userIndex],
    ...(nombre && { nombre }),
    ...(email && { email }),
    ...(fechaDeNacimiento && { fechaDeNacimiento: new Date(fechaDeNacimiento).toISOString() }),
    ...(categoria && { categoria })
  };
  
  res.json(users[userIndex]);
});

// Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});