import { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Fuse from "fuse.js";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  // Market ve kategori array'leri
  const shops = [
    { id: 1, name: "Migros" },
    { id: 2, name: "Teknosa" },
    { id: 3, name: "BİM" },
    // ... Diğer marketler
  ];

  const categories = [
    { id: 1, name: "Elektronik" },
    { id: 2, name: "Şarküteri" },
    { id: 3, name: "Oyuncak" },
    { id: 4, name: "Bakliyat" },
    { id: 5, name: "Fırın" },
    // ... Diğer kategoriler
  ];

  // Ürün state'i
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Filtre state'leri
  const [filteredShopId, setFilteredShopId] = useState("all");
  const [filteredCategoryId, setFilteredCategoryId] = useState("all");
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [filteredName, setFilteredName] = useState("");

  // Yeni ürün state'i
  const [newProduct, setNewProduct] = useState({
    name: "",
    shop: "",
    category: "",
  });

// Yeni ürün state'ini güncelleyen işlev
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    [name]: value,
  }));
};

// Filtre değişikliklerine tepki olarak tabloyu güncelle
useEffect(() => {
  // Filtrelenmiş ürünleri oluştur
  const filteredProducts = products.filter((product) => {
    const shopFilter =
      filteredShopId === "all" || product.shop === filteredShopId;
    const categoryFilter =
      filteredCategoryId === "all" || product.category === filteredCategoryId;
    const statusFilter =
      filteredStatus === "all" ||
      (filteredStatus === "bought" && product.isBought) ||
      (filteredStatus === "notBought" && !product.isBought);

    return (
      shopFilter &&
      categoryFilter &&
      statusFilter &&
      fuzzySearch(product.name, filteredName)
    );
  });

  setFilteredProducts(filteredProducts);
}, [filteredShopId, filteredCategoryId, filteredStatus, filteredName, products]);

  // Fuzzy search işlevi
  const fuzzySearch = (productName, searchText) => {
    const fuse = new Fuse([productName], { keys: ["productName"] });
    const result = fuse.search(searchText);

    return result.length > 0;
  };

  // Ürünü satın al işlevi
  const handleProductClick = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isBought: !product.isBought }
          : product
      )
    );
  };

  // Ürünü silme işlevi
  const handleProductDelete = (productId) => {
    // Alışveriş tamamlandıysa alert patlat
    if (
      products.every((product) => product.isBought) &&
      products.length > 0
    ) {
      alert("Alışveriş Tamamlandı!");
      // Konfeti patlatmak için konfeti fonksiyonunu çağır
      triggerConfetti();
    }

    // Ürünü sil
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  // Konfeti patlatma işlevi (örnek)
  const triggerConfetti = () => {
    console.log("Konfeti patlat!");
    // Burada gerçek bir konfeti animasyonu başlatılabilir
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Formun sayfayı yeniden yüklemesini engelle
  
    // Form verilerini kullanarak yeni ürün ekleyin
    const newProduct = {
      id: products.length + 1, // Yeni ürünün benzersiz bir ID'si olmalı
      name: e.target.elements.name.value,
      shop: e.target.elements.shop.value,
      category: e.target.elements.category.value,
      isBought: false,
    };
  
    // Yeni ürünü state'e ekleyin
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  
    // Formu sıfırlayın
    setNewProduct({
      name: "",
      shop: "",
      category: "",
    });
  };

  return (
    <div>
      <h1>Alışveriş Listesi Uygulaması</h1>
      <h2>Ürün Ekle</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Ürün Adı:
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Market:
          <select
            name="shop"
            value={newProduct.shop}
            onChange={handleInputChange}
          >
            <option value="">-- Seçiniz --</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Kategori:
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
          >
            <option value="">-- Seçiniz --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Ekle</button>
      </form>
      <h2>Filtrele</h2>
      <Form>
        {/* ... (Filtre kutuları) */}
        {/* ... (Daha önceki form elemanları) */}
        <Form.Group>
          <Form.Label>Market</Form.Label>
          <Form.Control
            as="select"
            value={filteredShopId}
            onChange={(e) => setFilteredShopId(e.target.value)}
          >
            <option value="all">Tümü</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Kategori</Form.Label>
          <Form.Control
            as="select"
            value={filteredCategoryId}
            onChange={(e) => setFilteredCategoryId(e.target.value)}
          >
            <option value="all">Tümü</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Satın Alma Durumu</Form.Label>
          <Form.Check
            inline
            label="Tümü"
            type="radio"
            id="all"
            checked={filteredStatus === "all"}
            onChange={() => setFilteredStatus("all")}
          />
          <Form.Check
            inline
            label="Satın Alınanlar"
            type="radio"
            id="bought"
            checked={filteredStatus === "bought"}
            onChange={() => setFilteredStatus("bought")}
          />
          <Form.Check
            inline
            label="Satın Alınmayanlar"
            type="radio"
            id="notBought"
            checked={filteredStatus === "notBought"}
            onChange={() => setFilteredStatus("notBought")}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ürün Adı</Form.Label>
          <Form.Control
            type="text"
            value={filteredName}
            onChange={(e) => setFilteredName(e.target.value)}
          />
        </Form.Group>
      </Form>
      <h2>Ürünler</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ürün Adı</th>
            <th>Market</th>
            <th>Kategori</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              style={{
                textDecoration: product.isBought ? "line-through" : "none",
              }}
            >
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.shop}</td>
              <td>{product.category}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleProductDelete(product.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;