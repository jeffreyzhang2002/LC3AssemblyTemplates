import React from 'react';
import Styled from 'styled-components';

const Container = Styled.textarea`
    margin: 1em;
    padding: 1em;
    width: 100fr;
    height: 100fr;
    background-color: #FFFFFF15;
    grid-area: input;
    border-radius: 10px;
    outline: none;
    border: none;
    color: #39FF14;
    resize: none;
    font-size: 1.5em;
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

const initialValue = ";; LC3 ASSEMBLY PREPROCESSOR + TEMPLATES\n;; CHECK DOCUMENTATION ABOVE\n;; PRESS ENTER TO RUN";

export default class Input extends React.Component{

    constructor(props) {
        super(props);
    }

    onKeyPress = (event) => {
        if(event.key === 'Enter') {
            this.props.updateContent(event.target.value);
        }
    }

    onKeyDown = (event) => {
        if(event.key === "Tab") {
            event.preventDefault();
            event.target.setRangeText('    ', event.target.selectionStart, event.target.selectionStart, 'end')
        }
    }

    render() {
        return (
            <Container defaultValue={initialValue} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown}>
            </Container>
        );
    }
}
