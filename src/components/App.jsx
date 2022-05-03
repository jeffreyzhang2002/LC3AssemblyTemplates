import React from 'react';
import Styled from 'styled-components';

import Header from "./Header";
import Input from "./Input";
import Output from "./Output";
import {parser, transform} from "../Utils";

const Container = Styled.div`
    background-color: #121212;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 7fr 93fr;
    grid-template-areas: "header header" "input output";
`;

export default class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {content: ""};
    }

    updateContent = (content) => {
        this.setState({content: transform(parser(content))});
    }

    render() {
        return (
            <Container>
                <Header/>
                <Input updateContent={this.updateContent}/>
                <Output content={this.state.content}/>
            </Container>
        );
    }
}
