export const Empty = (props: { text?: string }) => {
  return (
    <p className="text-center text-whiteColor text-l font-light">
      {props.text}
    </p>
  );
};
