import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";
import cn from "classnames";

type Props = {
  preview?: boolean;
};

const Alert = ({ preview }: Props) => {
  return (
    <div
      className={cn("border-b dark:bg-slate-800", {
       
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          
        </div>
      </Container>
    </div>
  );
};

export default Alert;
