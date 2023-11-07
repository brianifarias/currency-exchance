import { useState } from 'react';
import './App.css';
import Card from './components/Card/Card';
import PageHeading from './components/PageHeading/PageHeading';
import SubHeading from './components/SubHeading/SubHeading';

function App() {
  const [amount, setAmount] = useState(1.0);
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const [total, setTotal] = useState(1);

  return (
    <div className='mb-5'>
      <PageHeading />
      <SubHeading amount={amount} from={from} to={to} total={total.toFixed(2)} />
      <Card amount={amount} setAmount={setAmount} setFrom={setFrom} setTo={setTo} setTotal={setTotal} />
    </div>
  );
}

export default App;
