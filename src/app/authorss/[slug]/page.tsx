import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { getAllAuthors } from "@/lib/api"; // Импортируем функцию для получения авторов
import { CMS_NAME } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import { PostHeader } from "@/app/_components/post-header";
import Avatar from "@/app/_components/avatar"; // Импортируем компонент Avatar

export default async function Post({ params }: Params) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const authors = await getAllAuthors(); // Получаем всех авторов

  return (
    <main>
      <Alert preview={post.preview} />
      <Container>
        <Header />
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={content} />
        </article>
        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-8">Готовые профили</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors && authors.length > 0 ? ( // Проверяем, есть ли авторы
              authors.map((author) => (
                <div key={author.name} className="border p-4 rounded-lg"> {/* Используем author.name вместо author.id */}
                  <Avatar name={author.name} picture={author.picture} />
                  <h3 className="text-2xl font-semibold">{author.name}</h3>
                  <p className="text-gray-600">
                    {author ? (author.bio as string | undefined) || "Нет информации о биографии." : "Нет информации о биографии."} {/* Проверка на наличие author */}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Нет доступных профилей.</p> // Сообщение, если авторов нет
            )}
          </div>
        </section>
      </Container>
    </main>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Next.js Blog Example with ${CMS_NAME}`;

  return {
    title,
    openGraph: {
      title,
      images: [post.ogImage.url],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
