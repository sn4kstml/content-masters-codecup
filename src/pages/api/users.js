import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  try {
    const { rows } = await sql`SELECT * FROM users;`;
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при выполнении запроса' });
  }
}
