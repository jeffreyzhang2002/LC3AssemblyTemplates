import React from 'react';
import Styled from 'styled-components';

const Container = Styled.div`
    margin: 1em;
    padding: 1em;
    width: 100fr;
    height: 100fr;
    background-color: #FFFFFF15;
    grid-area: output;
    border-radius: 10px;
    outline: none;
    border: none;
    color: #39FF14;
    resize: none;
    font-size: 1.2em;
    
    overflow: auto;
    
    white-space: pre-line;
    
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #3700B3;
      border-radius: 10px;
    }
    
`;

export default class Output extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                {this.props.content}
            </Container>
        );
    }

}
