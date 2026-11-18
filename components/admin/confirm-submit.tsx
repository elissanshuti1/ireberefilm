"use client";

type Props = {
  children: React.ReactNode;
  message?: string;
  className?: string;
  title?: string;
};

export default function ConfirmSubmit({ children, message, className, title }: Props) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(event) => {
        if (message && !window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
