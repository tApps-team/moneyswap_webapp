import { EmptyIcon } from "@/shared/assets";

export const Empty = (props: { text?: string }) => {
  return (
    <div className="grid gap-6 mt-[7vh] justify-center items-center grayscale">
      <EmptyIcon className="w-[35vw] h-[35vw] max-w-[200px] max-h-[200px] mx-auto" />
      <p className="text-center text-whiteColor text-l font-light">
        {props.text}
      </p>
    </div>
  );
};
