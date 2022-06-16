import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeAction } from '../store/reducers/name';
import { bindActionCreators } from 'redux';
import { addAction, minusAction } from '../store/reducers/index';

const FirstPage: React.FC = () => {
  const number: number = useSelector<any, number>(
    (state) => state.counter.number
  );

  const name: string = useSelector<any, string>((state) => state.name.name);

  const dispatch = useDispatch();

  const bindActions = bindActionCreators(
    {
      add: addAction,
      minus: minusAction,
    },
    dispatch
  );

  const handleAdd = () => {
    // dispatch(addAction(Math.random() * 100));
    bindActions.add(100);
  };

  const handleMinus = () => {
    // dispatch(minusAction(Math.random() * 100));
    bindActions.minus(100);
  };

  const handleChangeName = () => {
    dispatch(changeAction('19Qingfeng'));
  };

  return (
    <div>
      <p>{number}</p>
      <button onClick={handleAdd}>add</button>
      <button onClick={handleMinus}>minus</button>
      <div>
        My name is: <span style={{ color: 'red' }}>{name}</span>
        <button onClick={handleChangeName}>change nick name</button>
      </div>
    </div>
  );
};

export default FirstPage;
