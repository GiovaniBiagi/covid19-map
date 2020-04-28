import React from 'react';
import { Card } from 'antd';
import classnames from 'classnames';

import './styles.css';

// import { Container } from './styles';

export default function Cards({children, cssUncommonClass}) {
  return (
    <div>
        <Card
        style={{ width: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 15}}
        bordered={false}
        className={classnames('card', cssUncommonClass)}
        >
            {children}
        </Card>
    </div>
  );
}
