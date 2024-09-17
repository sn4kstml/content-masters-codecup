"use client"; // Помечаем компонент как клиентский
import { sql } from "@vercel/postgres";

import { CMS_NAME } from "@/lib/constants";
import React from "react";

const connectionString = process.env.POSTGRES_URL || "postgres://default:GLXoYv9IwQJ4@ep-summer-cloud-a22b2x5a.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require";

export function Intro() {
  const fetchUsers = async () => {
    try {
      const { rows } = await sql`SELECT * FROM users;`;
      alert(JSON.stringify(rows, null, 2)); // Выводим результат в alert
    } catch (error) {
      console.error(error);
      alert('Ошибка: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        Статья.
      </h1>
      <button 
        onClick={fetchUsers} 
        className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Показать пользователей
      </button>
    </section>
  );
}
