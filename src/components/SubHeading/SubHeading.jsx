import { useState } from "react";

const SubHeading = ({ amount, from, to, total }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1A8DFF',
        height: 300,
        paddingLeft: 48,
        paddingRight: 48,
        paddingTop: 30,
		marginBottom: -150
      }}>
      <h2 style={{ color: 'white', fontWeight: '600', fontSize: 40, textAlign: 'center' }}>{`${amount} ${from} to ${to} - ${total}`}</h2>
    </div>
  );
};

export default SubHeading;
