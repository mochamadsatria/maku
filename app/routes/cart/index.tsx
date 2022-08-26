function EmptyCart() {
  return <div></div>;
}

const mock = [
  {
    name: "",
    pcs: 2,
    price: 1242424,
  },
];

function CartItem(data: []) {
  return (
    <div>
      <ul>
        {data.map((item: any) => (
          <li>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Page() {
  return <div></div>;
}
