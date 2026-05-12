import React from "react";

BookComp=(props)=>{
     <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.text}
        </Card.Text>
        <Button variant="primary">Details</Button>
      </Card.Body>
    </Card>

}