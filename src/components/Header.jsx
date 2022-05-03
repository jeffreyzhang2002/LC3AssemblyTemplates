import React from 'react';
import Styled from 'styled-components';

const Container = Styled.div`
    width: 100fr;
    height: 100fr;
    margin: 0 1em;
    border-radius: 10px;
    background-color: #3700B3;
    grid-area: header;
    
    display: flex;
    justify-content: center;
`;

const Doc = Styled.div`
    Height: 100%;
    width: 25%;
    Color: white;
    padding-left: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    &:hover{
        color: orange;
    }
`

const About = Styled.div`
    Height: 100%;
    width: 25%;
    Color: white;
    padding-right: 1em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    align-items: flex-end;
    
    &:hover{
        color: orange;
    }
`

const Title = Styled.div`
    Height: 100%;
    width: 50%;
    Font-size: 3em;
    Color: white;
    Text-Align: Center;
   
`

export default class Header extends React.Component{

    render() {
        return (
            <Container>
                <Doc> Documentation </Doc>
                <Title> LC3 Assembly Templates </Title>
                <About> Github </About>
            </Container>
        );
    }
}
