import React,{useEffect, useState} from 'react'

import CommonSection from '../components/UI/CommonSection'
import Helmet from './../components/Helmet/Helmet';
import { Row, Container, Col } from 'reactstrap';

import '../styles/shop.css'

//import products from './../assets/data/products';
import ProductList from './../components/UI/ProductList';


import {useSelector} from 'react-redux';

 const Shop = () => {

  const products = useSelector((state) => state.products.products);

  const [productsData, setProductsData] = useState(products);


  useEffect(()=>{
    setProductsData(products);
  },[products])

  const handleFilter = e=>{
    const filterValue = e.target.value;
    if(filterValue ==='iphone'){
      const filteredProducts= products.filter(
        (item) => item.category === "iphone"
      );
      setProductsData(filteredProducts);
    }else if(filterValue ==='ipad'){
      const filteredProducts= products.filter(
        (item) => item.category === "ipad"
      );
      setProductsData(filteredProducts);
    }
    else if(filterValue ==='macbook'){
      const filteredProducts= products.filter(
        (item) => item.category === "macbook"
      );
      setProductsData(filteredProducts);
    }
    else if(filterValue ==='accessory'){
      const filteredProducts= products.filter(
        (item) => item.category === "accessory"
      );
      setProductsData(filteredProducts);
    }
    else{
      setProductsData(products);
    }
  }

  const handleSearch = e=>{
    const searchTerm = e.target.value;

    const searchedProducts= products.filter(
      (item) => item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setProductsData(searchedProducts);
  }

  const handleSort = (e) =>{

      const filteredPoducts = productsData.slice().sort((a, b) => {
        const {price} = a;
        const {price: priceB} = b;

        switch (e.target.value) {
          case 'desc':
            return priceB - price;
          case 'asc':
            return price - priceB;
          default:
            return price - priceB;
        }
      });

      setProductsData([]);

      setProductsData(productsData=> ([...productsData, ...filteredPoducts]));

      

  }

  useEffect(()=>{
    window.scrollTo(0, 0);
  })


   return <Helmet title='Shop' >
    <CommonSection title='Products' />

    <section>
      <Container>
        <Row>
          <Col lg='3' md='6' className='col__filter-widget'>
            <div className="filter__widget mb-md-4">
              <select onChange={handleFilter}>
              <option style={{fontSize: '16px'}}>Filter By Category</option>
                <option style={{fontSize: '16px'}} value="iphone">Iphone</option>
                <option style={{fontSize: '16px'}} value="ipad">Ipad</option>
                <option style={{fontSize: '16px'}} value="macbook">MacBook</option>
                <option style={{fontSize: '16px'}} value="accessory">Accessory</option>
              </select>
            </div>
          </Col>
          <Col lg='3' md='6' className='text-end col__filter-widget'>
          <div className="filter__widget mb-md-4">
              <select onChange={handleSort}>
              <option style={{fontSize: '16px'}}>Sort By</option>
                <option style={{fontSize: '16px'}} value="asc">Price: Low to High</option>
                <option style={{fontSize: '16px'}} value="desc">Price: High to Low</option>
              </select>
            </div>
          
          </Col>
          <Col lg='6' md='12'>
            <div className="search__box">
              <input type="text" placeholder='Search.....' 
              onChange={handleSearch}/>
              <span>
                <i className="ri-search-line"></i>
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    <section className='pt-0'>
    <Container>
        <Row>
          {
            productsData.length === 0? <h1 className='text-center fs-4'>No Products are found!</h1>
            : <ProductList data={productsData} />
          }
        </Row>
    </Container>
    </section>
   </Helmet>
 }
 
 export default Shop