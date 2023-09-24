import React, { useState, useRef, useEffect } from "react";
import { Form, FormGroup, Container, Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";

const UpdateProducts = () => {
  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterShortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);

  const [trending, setTrending] = useState(false);
  const [bestSales, setBestSales] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const [populary, setPopulary] = useState(false);

  const [storagePrices, setStoragePrices] = useState(null);
  const [colorsNumber, setColorsNumber] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [active, setActive] = useState(false);

  const [active1, setActive1] = useState(false);

  const navigate = useNavigate();

  const [product, setProduct] = useState({});

  const { id } = useParams();

  const docRef = doc(db, 'products', id);

  useEffect(() =>{
    const getProduct = async() =>{
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        setProduct(docSnap.data());
      }else{
        console.log('no product!');
      } 
    }

    getProduct();
  }, [id])

  useEffect(() =>{
    if (product) {

      if (product?.productName) setEnterTitle(product?.productName)
      if (product?.shortDesc) setEnterShortDesc(product?.shortDesc)
      if (product?.description) setEnterDescription(product?.description)
      if (product?.price) setEnterPrice(product?.price)

      if (product?.trending) setTrending(product?.trending)
      if (product?.bestSales) setBestSales(product?.bestSales)
      if (product?.newProduct) setNewProduct(product?.newProduct)
      if (product?.popular) setPopulary(product?.popular)

      if (product?.category) setEnterCategory(product?.category)

      if (product?.colors && product?.colors?.length > 0){ 
        setActive1(true)
        setColors(product?.colors)
        handleMap(product?.colors?.length)
      }
      if (product?.storage){ 
        setActive(true)
        setStoragePrices(product?.storage)
      }
    }
  }, [product])

console.log(enterProductImg);

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    // =========== add product to the firebase database ===========================

    try {

      if (enterProductImg) {
        
        const storageRef = ref(
          storage,
          `productImages/${Date.now() + enterProductImg.name}`
        );
  
        const uploadTask = uploadBytesResumable(storageRef, enterProductImg).then(
          () => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
              await updateDoc(doc(db, "products", id), {
                productName: enterTitle,
                shortDesc: enterShortDesc,
                description: enterDescription,
                category: enterCategory,
                price: enterPrice,
                imgUrl: downloadURL,
                storage: storagePrices,
                colors: colors,
                trending: trending,
                bestSales: bestSales,
                newProduct: newProduct,
                popular: populary,
              });
            });
  
            setLoading(false);
  
            toast.success("product successfully added");
  
            navigate("/dashboard/all-products");
          }
  
        );
      }else{
        await updateDoc(doc(db, "products", id), 
        {
          productName: enterTitle,
          shortDesc: enterShortDesc,
          description: enterDescription,
          category: enterCategory,
          price: enterPrice,
          storage: storagePrices,
          colors: colors,
          trending: trending,
          bestSales: bestSales,
          newProduct: newProduct,
          popular: populary,
        });

        setLoading(false);
  
        toast.success("product updated");

        navigate("/dashboard/all-products");
      }
    } catch (err) {
      setLoading(false);
      toast.error("update failed " + err);
    }

    //console.log(product);
  };

//console.log(colors);

const handleMap = (length) =>{
  let table = []

  for (let index = 0; index < length; index++) {
    table[index] = index + 1
    
  }

  setColorsNumber(table)
}

const handleSetColorName = (e, id) =>{

  let table = colors
  
  for (let index = 0; index <= (id); index++) {
    if (index == id) {
      if (!table[index]){

        table[index] = {}
      }
      table[index].name = e.target.value
    }
  }

  setColors(table)
}

const handleSetColor = (e, id) =>{
  let table = colors

  for (let index = 0; index <= (id); index++) {
    if (index == id) {
      if (!table[index]) {
        
        table[index] = {}
      }
      table[index].code = e.target.value + ""
    }
    
  }

  setColors(table)
}

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5">Chargement......</h4>
            ) : (
              <>
                <h4 className="mb-5">Modifier <span className="fw-bold">{product?.productName}</span></h4> 
                <Form onSubmit={updateProduct}>
                  <FormGroup className="form__group">
                    <span>Product title</span>
                    <input
                      type="text"
                      placeholder={product?.productName}
                      value={enterTitle}
                      onChange={(e) => setEnterTitle(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <span>Short Description</span>
                    <input
                      type="text"
                      placeholder={product?.shortDesc}
                      value={enterShortDesc}
                      onChange={(e) => setEnterShortDesc(e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <span>Description</span>
                    <input
                      type="text"
                      placeholder={product?.description}
                      value={enterDescription}
                      onChange={(e) => setEnterDescription(e.target.value)}
                    />
                  </FormGroup>

                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <span>Price</span>
                      <input
                        type="number"
                        placeholder={product?.price}
                        value={enterPrice}
                        onChange={(e) => setEnterPrice(e.target.value)}
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>Category</span>
                      <select
                        required
                        className="w-100 p-2"
                        value={enterCategory}
                        onChange={(e) => setEnterCategory(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        <option value="iphone">Iphone</option>
                        <option value="ipad">Ipad</option>
                        <option value="macbook">MacBook</option>
                        <option value="accessory">Accessory</option>
                      </select>
                    </FormGroup>
                  </div>

                  <div>
                    <FormGroup className="form__group">
                      <span>Product Image</span>
                      <input
                        type="file"
                        onChange={(e) => setEnterProductImg(e.target.files[0])}
                      />
                    </FormGroup>
                  </div>

                  
                  <div className="d-flex align-items-center gap-5">

                    <div className="form-check mb-3 mt-2" >
                      <label className="form-check-label" htmlFor="flexCheckDefault1" style={{cursor: "pointer"}}>
                        Trending Product
                      </label>
                      <input
                      style={{cursor: "pointer"}}
                        className="form-check-input"
                        type="checkbox"
                        checked = {trending}
                        id="flexCheckDefault1"

                        onChange={e => setTrending(!trending)}
                      />
                      
                    </div>

                    <div className="form-check mb-3 mt-2" >
                      <label className="form-check-label" htmlFor="flexCheckDefault3" style={{cursor: "pointer"}}>
                        Best Sales
                      </label>
                      <input
                      style={{cursor: "pointer"}}
                        className="form-check-input"
                        type="checkbox"
                        checked = {bestSales}
                        id="flexCheckDefault3"

                        onChange={e => setBestSales(!bestSales)}
                      />
                      
                    </div>

                    <div className="form-check mb-3 mt-2" >
                      <label className="form-check-label" htmlFor="flexCheckDefault4" style={{cursor: "pointer"}}>
                        New Product
                      </label>
                      <input
                      style={{cursor: "pointer"}}
                        className="form-check-input"
                        type="checkbox"
                        checked = {newProduct}
                        id="flexCheckDefault4"

                        onChange={e => setNewProduct(!newProduct)}
                      />
                      
                    </div>

                    <div className="form-check mb-3 mt-2" >
                      <label className="form-check-label" htmlFor="flexCheckDefault5" style={{cursor: "pointer"}}>
                        Popular
                      </label>
                      <input
                      style={{cursor: "pointer"}}
                        className="form-check-input"
                        type="checkbox"
                        checked = {populary}
                        id="flexCheckDefault5"

                        onChange={e => setPopulary(!populary)}
                      />
                      
                    </div>

                    <div className="form-check mb-3 mt-2" >
                      <label className="form-check-label" htmlFor="flexCheckDefault6" style={{cursor: "pointer"}}>
                        Storage
                      </label>
                      <input
                      style={{cursor: "pointer"}}
                        className="form-check-input"
                        type="checkbox"
                        checked = {active}
                        onChange={e=>setActive(true)}
                        id="flexCheckDefault6"
                        data-toggle="modal"
                        data-target="#exampleModal"
                      />
                      
                    </div>

                    <div className="form-check mb-3 mt-2" >
                      <label className="form-check-label" htmlFor="flexCheckDefault7" style={{cursor: "pointer"}}>
                        Color
                      </label>
                      <input
                      style={{cursor: "pointer"}}
                        className="form-check-input"
                        type="checkbox"
                        checked = {active1}
                        onChange={e=>setActive1(true)}
                        id="flexCheckDefault7"
                        data-toggle="modal"
                        data-target="#exampleModal1"
                      />
                      
                    </div>
                  </div>
                 

                  <button className="buy__btn" type="submit">
                    Update product
                  </button>
                </Form>
              </>
            )}
          </Col>
        </Row>



        <div
        className="modal fade auction__popup "
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div
              type="button"
              className="close  position-absolute text-end fs-1"
              data-dismiss="modal"
              aria-label="Close"
              style={{ right: 10, top: 0, zIndex: 1000 }}
              onClick={e=> [setStoragePrices(null), setActive(false)]}
            >
              <span aria-hidden="true">&times;</span>
            </div>
            <div className="modal-body p-4">
            <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <span>64GO</span>
                      <input
                        required
                        type="number"
                        placeholder="1000XAF"
                        value={storagePrices?.size_64?.price}
                        onChange={(e) => setStoragePrices({...storagePrices, size_64:{ storage: "64GO", price: e.target.value}})}
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>128GO</span>
                      <input
                        required
                        type="number"
                        placeholder="1000XAF"
                        value={storagePrices?.size_128?.price}
                        onChange={(e) => setStoragePrices({...storagePrices, size_128:{ storage: "128GO", price: e.target.value}})}
                      />
                    </FormGroup>
                    
            </div>

            <div className="d-flex align-items-center justify-content-between gap-5">

            <FormGroup className="form__group w-50">
                      <span>256GO</span>
                      <input
                        required
                        type="number"
                        placeholder="1000XAF"
                        value={storagePrices?.size_256?.price}
                        onChange={(e) => setStoragePrices({...storagePrices, size_256:{ storage: "256GO", price: e.target.value}})}
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>512GO</span>
                      <input
                        required
                        type="number"
                        placeholder="1000XAF"
                        value={storagePrices?.size_512?.price}
                        onChange={(e) => setStoragePrices({...storagePrices, size_512:{ storage: "512GO", price: e.target.value}})}
                      />
                    </FormGroup>

                    
                    
            </div>

            <div className="d-flex align-items-center justify-content-between gap-5">
                   

                    <FormGroup className="form__group w-50">
                      <span>1TO</span>
                      <input
                        required
                        type="number"
                        placeholder="1000XAF"
                        value={storagePrices?.size_1000?.price}
                        onChange={(e) => setStoragePrices({...storagePrices, size_1000:{ storage: "1TO", price: e.target.value}})}
                      />
                    </FormGroup>
                    
            </div>

            </div>

            <div class="modal-footer d-flex align-items-center justify-content-center">
            <button type="button" class="buy__btn w-100" data-dismiss="modal"
              aria-label="Close">Save</button>
          </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade auction__popup "
        id="exampleModal1"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div
              type="button"
              className="close  position-absolute text-end fs-1"
              data-dismiss="modal"
              aria-label="Close"
              style={{ right: 10, top: 0, zIndex: 1000 }}
              onClick={e=> [setColors(new Array(0)), setColorsNumber([]), setActive1(false)]}
            >
              <span aria-hidden="true">&times;</span>
            </div>
            <div className="modal-body p-4">
                    <FormGroup className="form__group w-100">
                      <span>Colors Number</span>
                      <input
                      className="w-100"
                        required
                        type="number"
                        placeholder="Color list..."
                        value={colorsNumber?.length > 0 ? colorsNumber?.length : null}
                        min="0"
                        onChange={(e) => handleMap(e.target.value)}
                      />
                    </FormGroup>

                    {colorsNumber.length > 0 &&
                      colorsNumber.map((color, index) =>(
                        <div key={index} className="d-flex align-items-center justify-content-between gap-5"> 
                          <span>Color Number : {index + 1} </span>
                          <FormGroup className="form__group w-100">
                          <input
                          className="w-100"
                            required
                            type="text"
                            placeholder="color Name"
                            value={colors[index]?.name}
                            //onChange={(e) => setColorsNumber(e.target.value)}
                            onChange={(e) => handleSetColorName(e, index)}
                          />
                        </FormGroup>

                        <FormGroup className="form__group w-100">
                          <input
                          className="w-100"
                            required
                            type="color"
                            placeholder="color Code"
                            value={colors[index]?.code || null}
                            onChange={(e) => handleSetColor(e, index)}
                            //onChange={e=> console.log(e.target.value)}
                          />
                        </FormGroup>
                    </div>
                      ))
                    }

                    
            
            </div>

            <div class="modal-footer d-flex align-items-center justify-content-center">
            <button type="button" class="buy__btn w-100" data-dismiss="modal"
              aria-label="Close">Save</button>
          </div>
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
};

export default UpdateProducts;
