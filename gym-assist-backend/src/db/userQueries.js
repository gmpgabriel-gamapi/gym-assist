const db = require("./index");

const findUserByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
};

const createUser = async ({ name, email, passwordHash, status = "active" }) => {
  const { rows } = await db.query(
    "INSERT INTO users (name, email, password_hash, status) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, status",
    [name, email, passwordHash, status]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await db.query(
    "SELECT id, name, email, role, birth_date, gender, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0];
};

const updateUserProfile = async (userId, { name, gender, birth_date }) => {
  const fields = [];
  const values = [];
  let query = "UPDATE users SET ";

  if (name !== undefined) {
    values.push(name);
    fields.push(`name = $${values.length}`);
  }
  if (gender !== undefined) {
    values.push(gender);
    fields.push(`gender = $${values.length}`);
  }
  if (birth_date !== undefined) {
    values.push(birth_date);
    fields.push(`birth_date = $${values.length}`);
  }

  if (values.length === 0) {
    return findUserById(userId);
  }

  query += fields.join(", ");
  values.push(userId);
  query += ` WHERE id = $${values.length} RETURNING id, name, email, role, birth_date, gender, created_at`;

  const { rows } = await db.query(query, values);
  return rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserProfile,
};
