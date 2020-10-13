import React, { Component } from "react";
import { Modal, Button, Form,Table,Container } from "react-bootstrap";
import "whatwg-fetch";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      productAddModal: false,
      productDeleteModal: false,
      productEditModal: false,
      price:0,
      name:""
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () =>{
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          products: json,
        });
      });
  }

  newProduct = () => {
    let { name, price } =  this.state;
    if(!name && !price){
      return;
    }
    fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        this.toggleAddProductModal();
        this.fetchProducts();
      });
  };

  toggleAddProductModal = () => {
    this.setState((prevState) => {
      return {
        productAddModal: !prevState.productAddModal,
      };
    });
  };

  toggleDeleteProductModal = (product) => {
    this.setState((prevState) => {
      return {
        productDeleteModal: !prevState.productDeleteModal,
        id: product ? product._id : '',
        price: product ? product.price : 0,
        name: product ? product.name : 0,
      };
    });
  };

  toggleEditProductModal = (product) => {
    this.setState((prevState) => {
      return {
        productEditModal: !prevState.productEditModal,
        id: product ? product._id : '',
        price: product ? product.price : 0,
        name: product ? product.name : 0,
      };
    });
  };

  handleProduct = (e) => {
    this.setState({
        [e.target.id]: e.target.value
    })
  }

  handleEditProduct = () =>{
    const {id,name,price} =  this.state;
    fetch(`/api/product/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
      }),
    }).then((res) => {
      this.fetchProducts();
    }).catch((err)=>{
      console.error(err);
    }).finally(()=>{
      this.toggleEditProductModal();
    })
  }

  handleDeleteProduct = () =>{
    const {id} =  this.state;
    fetch(`/api/product/${id}`, { method: "DELETE" }).then((_) => {
      // this.modifyProduct(index, null);
      this.toggleDeleteProductModal();
      this.fetchProducts();
    }).catch((err)=>{
      this.toggleDeleteProductModal();
      console.error(err);
    })
  }

  render() {
    const { productAddModal,productEditModal,productDeleteModal,products,price,name } = this.state;
    const headers = ["Product ID","Name", "Price","Action"];
    return (
      <>
        <Container>
          <h1>Product List</h1>
          <Button onClick={this.toggleAddProductModal}>Add New</Button>
          <Table striped bordered hover className="my-2">
            <thead>
            <tr>
              {headers.map((header,key)=>{
                return <th key={key}>{header}</th>
              })}
            </tr>
          </thead>
            <tbody>
              {
                products.map((product,key)=>{
                  return (<tr key={key}>
                    <td>{key+1}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <Button onClick={()=>this.toggleEditProductModal(product)}>Edit</Button>
                      <Button className="ml-2" onClick={()=>this.toggleDeleteProductModal(product)} variant="danger">Delete</Button>
                    </td>
                  </tr>)
                })
              }
          </tbody>
          </Table>
        </Container>
        
        <Modal show={productAddModal} onHide={this.toggleAddProductModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control type="text" placeholder="Enter product name" id="name" onChange={this.handleProduct}/>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="number"
                  id="price"
                  placeholder="Enter price of the product"
                  onChange={this.handleProduct}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleAddProductModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.newProduct}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={productDeleteModal} onHide={this.toggleDeleteProductModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete the product <strong>{name}</strong> ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleDeleteProductModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleDeleteProduct}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={productEditModal} onHide={this.toggleEditProductModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control type="text" placeholder="Enter product name" id="name" value={name} onChange={this.handleProduct}/>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="number"
                  id="price"
                  value={price}
                  placeholder="Enter price of the product"
                  onChange={this.handleProduct}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.toggleEditProductModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleEditProduct}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Home;
