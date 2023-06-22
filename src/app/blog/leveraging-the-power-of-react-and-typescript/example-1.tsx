interface Props {
  name: string;
  age: number;
}

function Person({ name, age }: Props) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
}
