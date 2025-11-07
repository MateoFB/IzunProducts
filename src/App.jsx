  import React, { useState } from 'react';
import { Download, Upload, AlertCircle } from 'lucide-react';
import './App.css'

function App() {

  const [products, setProducts] = useState([
    {
      name: 'Hierba de San Juan',
      format: 'Polvo orgánico',
      description: 'Desde tiempos antiguos, la Hierba de San Juan ha sido recolectada en el solsticio, cuando los velos entre mundos se vuelven más delgados...',
      benefits: 'TÓNICO NERVIOSO, EQUILIBRIO EMOCIONAL, COMBATE LA TRISTEZA, PIEL SANA Y LUMINOSA...',
      posology: '',
      ingredients: 'Hypericum Perforatum',
      category: 'Nuestras Plantas',
      subcategory: 'Guías ancestrales',
      weight: '50g',
      volume: '',
      price: '',
      images: ''
    }
  ]);

  const [showInstructions, setShowInstructions] = useState(true);

  const addProduct = () => {
    setProducts([...products, {
      name: '',
      format: '',
      description: '',
      benefits: '',
      posology: '',
      ingredients: '',
      category: '',
      subcategory: '',
      weight: '',
      volume: '',
      price: '',
      images: ''
    }]);
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const loadFromGoogleSheets = () => {
    const sampleData = [
      {
        name: 'Hierba de San Juan',
        format: 'Polvo orgánico',
        description: 'Desde tiempos antiguos, la Hierba de San Juan ha sido recolectada en el solsticio, cuando los velos entre mundos se vuelven más delgados. Médicos como Hipócrates la reconocían, pero su historia es aún más profunda: se creía que alejaba los malos espíritus, y muchas culturas la usaban como un talismán contra la tristeza. Sus compuestos naturales son aliados del sistema nervioso, y ayudan a levantar el ánimo. Antiguamente mágica, hoy respaldada por la ciencia, es una aliada para quien busca claridad y equilibrio emocional.',
        benefits: 'TÓNICO NERVIOSO, EQUILIBRIO EMOCIONAL, COMBATE LA TRISTEZA, PIEL SANA Y LUMINOSA, ASTRINGENTE, TRATAMIENTO DE ADICCIONES, ANTIMICÓTICO Y ANTIBACTERIANO, MEJORA EL ESTADO DE ÁNIMO, AYUDA CONTRA EL INSOMNIO, AUMENTA LA SEROTONINA',
        posology: '',
        ingredients: 'Hypericum Perforatum',
        category: 'Nuestras Plantas',
        subcategory: 'Guías ancestrales',
        weight: '50g',
        volume: '',
        price: '',
        images: ''
      },
      {
        name: 'Artemisia',
        format: 'Polvo orgánico',
        description: 'En los jardines de la medicina china, la Artemisa Annua ha florecido por milenios como un tesoro. Su compuesto activo, la artemisinina, es hoy una de las armas más potentes contra la malaria, y ha sido adoptada por la ciencia moderna como una cura de impacto global. Pero su poder va más allá. Esta planta silvestre combate virus y bacterias resistentes, limpia al organismo de parásitos, regula los ciclos femeninos y protege los pulmones. Incluso fue investigada como parte del tratamiento contra el covid, confirmando lo que las tradiciones ya sabían: en la Artemisa vive una inteligencia sanadora, precisa y fuerte.',
        benefits: 'APOYO EN COVID, ANTIINFLAMATORIO, TRATA LA MALARIA, EQUILIBRIO HORMONAL, ANTIBACTERIANO, POTENTE ANTIPARASITARIO, COMBATE INFECCIONES RESISTENTES, PURIFICA EL CUERPO, REGULA EL CICLO MENSTRUAL, COMBATE INFECCIONES PULMONARES',
        posology: '',
        ingredients: 'ARTEMISA ANNUA',
        category: 'Nuestras Plantas',
        subcategory: 'Guías ancestrales',
        weight: '50g',
        volume: '',
        price: '',
        images: ''
      },
      {
        name: 'Tepezcohuite',
        format: 'Polvo orgánico',
        description: 'Desde tiempos ancestrales, este árbol ha sido venerado en México como un regalo de la selva. Su corteza —nuestra fuente principal— tiene el poder de cerrar heridas como si la tierra misma tejiera la piel con sus hilos invisibles. Considerado un árbol milagroso, sus propiedades antibacterianas y regenerativas lo han convertido en un tesoro. Los mayas lo utilizan también por vía interna, para restaurar el tracto digestivo. Es una medicina sabia, profunda, que entiende la piel, las entrañas y la energía vital. Ayuda al cuerpo a sanar desde la raíz.',
        benefits: 'ANTIBIÓTICO NATURAL, REGENERADOR CELULAR, COMBATE LA CÁNDIDA, CICATRIZANTE PROFUNDO, ALIADO EN ÚLCERAS, UTILIZADO PARA TRATAR LA AMEBIASIS, REPARA Y LIMPIA EL TRACTO INTESTINAL, USADO EN MASCARILLAS FACIALES, MUY UTILIZADO EN QUEMADURAS, POTENTE EFECTO ANTIFÚNGICO',
        posology: '',
        ingredients: 'MIMOSA TENUIFLORA',
        category: 'Nuestras Plantas',
        subcategory: 'Guías ancestrales',
        weight: '50g',
        volume: '',
        price: '',
        images: ''
      },
      {
        name: 'Aceite de Neem',
        format: 'Aceite orgánico',
        description: 'Extraído de las semillas del árbol de Neem por prensado en frío, este aceite ha sido utilizado durante siglos en el Ayurveda y la Medicina China para sanar la piel, cerrar heridas y repeler insectos. Su aroma profundo guarda una farmacia vegetal que calma la inflamación, alivia picaduras, nutre la piel sensible y actúa como barrera natural contra bacterias y hongos. No se recomienda su ingesta, pero su uso tópico es una medicina fuerte y poderosa. Versátil y fácil de utilizar, el aceite de Neem es indispensable en el botiquín.',
        benefits: 'FUERTE ANTIBACTERIAL, ANTIINFLAMATORIO, ALIVIA EL ACNÉ, REPELE INSECTOS, ANTICONCEPTIVO, AYUDA A LA CICATRIZACIÓN DE HERIDAS, REDUCE LAS MANCHAS CUTÁNEAS, POTENTE ANTIFÚNGICO NATURAL, FORTALECE Y REVITALIZA EL CABELLO, TRATA VARIOS TIPOS DE ECCEMA',
        posology: '',
        ingredients: 'AZADIRACHTA INDICA',
        category: 'Salud digestiva',
        subcategory: 'Detox',
        weight: '',
        volume: '30ml',
        price: '',
        images: ''
      },
      {
        name: 'Be Pure',
        format: 'Be Pure',
        description: 'BePure es una de esas medicinas esenciales, simples y poderosas. El oxígeno, base de la vida en la Tierra, también es uno de los agentes más efectivos para limpiar, desinfectar y vitalizar. Usada correctamente, esta fórmula al 3% puede aplicarse externamente para desinfectar heridas, aliviar infecciones y limpiar la piel, o internamente en protocolos supervisados para oxigenar el organismo. En la cocina, sirve para desinfectar frutas y verduras de forma segura. IZUN pone al alcance una herramienta antigua y moderna para depurar, oxigenar y sentirte más vital.',
        benefits: 'DESINFECTA HERIDAS, ELIMINA BACTERIAS, POTENTE ANTIFÚNGICO, DESINFECTANTE TÓPICO, VERSÁTIL ANTIVIRAL, REDUCE INFECCIONES DE GARGANTA, EXCELENTE PARA ENJUAGUES BUCALES, DESINFECTA FRUTAS Y VERDURAS, OXIGENA EL CUERPO A NIVEL CELULAR, GRAN ALIADO EN CASO DE GINGIVITIS',
        posology: '',
        ingredients: 'PERÓXIDO DE HIDRÓGENO AL 3%',
        category: 'Salud digestiva',
        subcategory: 'Detox',
        weight: '',
        volume: '250ml',
        price: '',
        images: ''
      },
      {
        name: 'Tónico Restaurativo',
        format: 'Tintura orgánica',
        description: 'Este tónico es un rescate natural para el cuerpo debilitado. El Muicle, medicina tradicional mexicana, ha sido usado para tratar dengue, anemia e infecciones virales gracias a su capacidad de regenerar la sangre e incrementar las plaquetas. Combinado con Moringa, Ortiga y Alfalfa, plantas ricas en minerales y clorofila, esta fórmula fortalece, remineraliza y devuelve el equilibrio interno tras períodos de agotamiento o enfermedad. Pura vitalidad para revertir la anemia y las deficiencias minerales de forma simple y natural. Un tónico para volver a ti, más fuerte, más vital, más tú.',
        benefits: 'TÓNICO CIRCULATORIO, AUMENTA LA VITALIDAD, REDUCE LA ANEMIA, BAJA LA FIEBRE, NIVELA EL COLESTEROL, REMINERALIZANTE COMPLETO NATURAL, APOYA LA RECUPERACIÓN POST VIRAL, MEJORA LA OXIGENACIÓN CELULAR, AUMENTA LAS PLAQUETAS, POSEE HIERRO, CLOROFILA Y MINERALES',
        posology: '',
        ingredients: 'Muicle, moringa, ortiga, alfalfa',
        category: 'Salud digestiva',
        subcategory: 'Detox',
        weight: '',
        volume: '30ml',
        price: '',
        images: ''
      }
    ];
    setProducts(sampleData);
  };

  const generateCSV = () => {
    const headers = [
      'Type',
      'Name',
      'Published',
      'Categories',
      'Description',
      'Short description',
      'Regular price',
      'Images',
      'Weight',
      'Attribute 1 name',
      'Attribute 1 value(s)',
      'Attribute 1 visible',
      'Attribute 2 name',
      'Attribute 2 value(s)',
      'Attribute 2 visible',
      'Attribute 3 name',
      'Attribute 3 value(s)',
      'Attribute 3 visible'
    ];

    const rows = products.map(p => {
      const category = p.subcategory 
        ? `${p.category} > ${p.subcategory}`
        : p.category;
      
      const weightOrVolume = p.volume || p.weight;

      return [
        'simple',
        p.name,
        '1',
        category,
        p.description,
        p.benefits,
        p.price,
        p.images,
        weightOrVolume,
        'Formato',
        p.format,
        '1',
        'Ingredientes',
        p.ingredients,
        '1',
        'Posología',
        p.posology || '',
        p.posology ? '1' : '0'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productos-woocommerce.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800 mb-2">
                Convertidor IZUN → WooCommerce
              </h1>
              <p className="text-gray-600">
                Convierte tus productos al formato CSV de WooCommerce
              </p>
            </div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition"
            >
              {showInstructions ? 'Ocultar' : 'Ver'} Instrucciones
            </button>
          </div>

          {showInstructions && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h3 className="font-bold mb-2">Instrucciones:</h3>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Haz clic en "Cargar datos de Google Sheets" para precargar tus 6 productos</li>
                    <li>Completa los campos faltantes: <strong>Precio</strong> y <strong>URLs de imágenes</strong></li>
                    <li>Para imágenes: sube primero las fotos a WordPress (Medios → Añadir nuevo) y copia las URLs</li>
                    <li>Múltiples imágenes se separan con coma: <code>url1.jpg, url2.jpg</code></li>
                    <li>Los atributos (Formato, Ingredientes, Posología) ya están incluidos automáticamente</li>
                    <li>Haz clic en "Descargar CSV" cuando termines</li>
                    <li>En WordPress: WooCommerce → Productos → Importar → Sube el CSV</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={loadFromGoogleSheets}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-md"
            >
              <Upload className="h-5 w-5" />
              Cargar datos de Google Sheets
            </button>
            <button
              onClick={addProduct}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              + Agregar Producto
            </button>
            <button
              onClick={generateCSV}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-md ml-auto"
            >
              <Download className="h-5 w-5" />
              Descargar CSV para WooCommerce
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-emerald-800">
                  Producto {index + 1}
                </h3>
                <button
                  onClick={() => removeProduct(index)}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre del producto *
                  </label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Formato
                  </label>
                  <input
                    type="text"
                    value={product.format}
                    onChange={(e) => updateProduct(index, 'format', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Descripción extendida
                  </label>
                  <textarea
                    value={product.description}
                    onChange={(e) => updateProduct(index, 'description', e.target.value)}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-white mb-1">
                    Beneficios (descripción corta)
                  </label>
                  <textarea
                    value={product.benefits}
                    onChange={(e) => updateProduct(index, 'benefits', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ingredientes
                  </label>
                  <input
                    type="text"
                    value={product.ingredients}
                    onChange={(e) => updateProduct(index, 'ingredients', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Posología (opcional)
                  </label>
                  <input
                    type="text"
                    value={product.posology}
                    onChange={(e) => updateProduct(index, 'posology', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Categoría
                  </label>
                  <input
                    type="text"
                    value={product.category}
                    onChange={(e) => updateProduct(index, 'category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    value={product.subcategory}
                    onChange={(e) => updateProduct(index, 'subcategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Peso (ej: 50g)
                  </label>
                  <input
                    type="text"
                    value={product.weight}
                    onChange={(e) => updateProduct(index, 'weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Volumen (ej: 30ml)
                  </label>
                  <input
                    type="text"
                    value={product.volume}
                    onChange={(e) => updateProduct(index, 'volume', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Precio * (solo número, ej: 1500)
                  </label>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) => updateProduct(index, 'price', e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    URLs de imágenes * (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={product.images}
                    onChange={(e) => updateProduct(index, 'images', e.target.value)}
                    placeholder="https://tusitioweb.com/imagen1.jpg, https://tusitioweb.com/imagen2.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App
