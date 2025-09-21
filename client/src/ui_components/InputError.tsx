const InputError = ({ error }: { error: string }) => {
  return <small className="text-red-700">{error}</small>;
};

export default InputError;
