import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  const { name, bio, keywords, specialization, tone, generatedArticles } = await request.json();

  try {
    const result = await sql`
      INSERT INTO authors (name, bio, keywords, specialization, tone, generated_articles)
      VALUES (${name}, ${bio}, ${keywords}, ${specialization}, ${tone}, ${generatedArticles})
      RETURNING id;
    `;
    const response = NextResponse.json({ id: result.rows[0].id }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  } catch (error) {
    console.error(error);
    const response = NextResponse.json({ error: 'Ошибка при сохранении данных.' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }

}

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM authors;`;
    console.log("Fetched authors:", rows); // Добавляем вывод данных авторов в консоль
    const response = NextResponse.json(rows, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  } catch (error) {
    console.error(error);
    const response = NextResponse.json({ error: 'Ошибка при получении данных.' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }
}