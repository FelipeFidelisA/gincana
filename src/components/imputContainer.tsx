const ImputContainer = (
    label: string,
    type: string,
    placeholder: string,
) => {
  return (
    <>
      <div>
        <label htmlFor="">{label}</label>
        <input type={type} name="" id="" placeholder={placeholder} />
      </div>
    </>
  );
};

export default ImputContainer;
