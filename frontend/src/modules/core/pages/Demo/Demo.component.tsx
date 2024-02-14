import React from 'react';

// import { Spin } from 'antd';

import './Demo.scss';

// import { usePokemonListQuery } from '../../../shared/apis/baseApi';

const Demo: React.FC = () => {
  // const { data, isSuccess, isLoading } = usePokemonListQuery('');

  // if (isSuccess) {
  //   console.log('Data: ', data);
  // }

  return (
    <div className="bg-white m-1">
      {/* {isLoading ? (
        <Spin></Spin>
      ) : (
        <div className="flex flex-col my-2">
          {data?.results?.map((item: { name: string; url: string }, index: number) => (
            <span key={index}>{item.name}</span>
          ))}
        </div>
      )} */}
    </div>
  );
};

export default Demo;
