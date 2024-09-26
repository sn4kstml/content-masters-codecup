import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";

const Header = () => {
  return (
<<<<<<< HEAD
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight md:tracking-tighter leading-tight mb-10 mt-4 flex items-center justify-between">
      <Link href="/" className="hover:underline text-3xl md:text-5xl font-bold ml-4 bg-transparent px-6 py-2">
        Статья.
      </Link>
      <Link href="/posts" className="hover:underline text-2xl md:text-4xl font-bold ml-4 bg-transparent px-4 py-1">
        готовые профили
=======
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 flex items-center">
      <Link href="/" className="hover:underline">
        Статья
>>>>>>> 95fb137e3eed03a79e8c3d95e3ddaa4016defc2e
      </Link>
    </h2>
  );
};
//рендерить ссылку на готовые профили
//либо react-router-dom
export default Header;


