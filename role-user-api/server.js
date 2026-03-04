const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const { dataRole, dataUser } = require("./data");

// ================= ROLE CRUD =================

// GET all roles
app.get("/roles", (req, res) => {
  res.json(dataRole);
});

// GET role by id
app.get("/roles/:id", (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });
  res.json(role);
});

// CREATE role
app.post("/roles", (req, res) => {
  const { id, name, description } = req.body;

  const newRole = {
    id,
    name,
    description,
    creationAt: new Date(),
    updatedAt: new Date()
  };

  dataRole.push(newRole);
  res.status(201).json(newRole);
});

// UPDATE role
app.put("/roles/:id", (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });

  role.name = req.body.name || role.name;
  role.description = req.body.description || role.description;
  role.updatedAt = new Date();

  res.json(role);
});

// DELETE role
app.delete("/roles/:id", (req, res) => {
  const index = dataRole.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Role not found" });

  dataRole.splice(index, 1);
  res.json({ message: "Deleted successfully" });
});

// ================= USER CRUD =================

// GET all users
app.get("/users", (req, res) => {
  res.json(dataUser);
});

// GET user by username
app.get("/users/:username", (req, res) => {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// CREATE user
app.post("/users", (req, res) => {
  const role = dataRole.find(r => r.id === req.body.roleId);
  if (!role) return res.status(400).json({ message: "Role not found" });

  const newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    status: true,
    loginCount: 0,
    role: role,
    creationAt: new Date(),
    updatedAt: new Date()
  };

  dataUser.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE user
app.put("/users/:username", (req, res) => {
  const user = dataUser.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.email = req.body.email || user.email;
  user.fullName = req.body.fullName || user.fullName;
  user.status = req.body.status ?? user.status;
  user.updatedAt = new Date();

  res.json(user);
});

// DELETE user
app.delete("/users/:username", (req, res) => {
  const index = dataUser.findIndex(u => u.username === req.params.username);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  dataUser.splice(index, 1);
  res.json({ message: "Deleted successfully" });
});

// ================= CUSTOM =================

// GET users by role
app.get("/roles/:id/users", (req, res) => {
  const role = dataRole.find(r => r.id === req.params.id);
  if (!role) return res.status(404).json({ message: "Role not found" });

  const users = dataUser.filter(u => u.role.id === req.params.id);
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});