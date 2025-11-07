import React, { useState } from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function App() {
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1JzyJH6hlZVFA-9CexvrMX8TsPSrmBsculL-TN4WvPN4/edit?gid=0#gid=0');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const extractSheetId = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const extractGid = (url) => {
    const match = url.match(/[#&]gid=([0-9]+)/);
    return match ? match[1] : '0';
  };

  const loadFromGoogleSheets = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const sheetId = extractSheetId(sheetUrl);
      const gid = extractGid(sheetUrl);
      
      if (!sheetId) {
        throw new Error('URL de Google Sheets no válida');
      }

      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('No se pudo acceder al Google Sheets. Asegúrate de que sea público.');
      }

      const csvText = await response.text();
      
      // Parser CSV mejorado que maneja saltos de línea dentro de comillas
      const parseCSV = (text) => {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const nextChar = text[i + 1];
          
          if (char === '"' && nextChar === '"' && inQuotes) {
            // Comillas dobles escapadas
            currentCell += '"';
            i++; // Skip next quote
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
          } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
              i++; // Skip \n in \r\n
            }
            if (currentCell || currentRow.length > 0) {
              currentRow.push(currentCell.trim());
              if (currentRow.some(cell => cell)) {
                rows.push(currentRow);
              }
              currentRow = [];
              currentCell = '';
            }
          } else {
            currentCell += char;
          }
        }
        
        // Add last cell and row
        if (currentCell || currentRow.length > 0) {
          currentRow.push(currentCell.trim());
          if (currentRow.some(cell => cell)) {
            rows.push(currentRow);
          }
        }
        
        return rows;
      };
      
      const rows = parseCSV(csvText);
      
      // Saltar la primera línea (headers)
      const dataRows = rows.slice(1);
      
      const parsedProducts = dataRows.map(values => {

        // Mapear columnas según estructura: SKU, Nombre, Formato, Descripción, Beneficios, Posología, Ingredientes, Categoría, Subcategoría, Peso, Volumen, Precio, Imágenes, Estado
        return {
          sku: values[0] || '',
          name: values[1] || '',
          format: values[2] || '',
          description: values[3] || '',
          benefits: values[4] || '',
          posology: values[5] || '',
          ingredients: values[6] || '',
          category: values[7] || '',
          subcategory: values[8] || '',
          weight: values[9] || '',
          volume: values[10] || '',
          price: values[11] || '',
          images: values[12] || '',
          status: values[13] || 'publish'
        };
      }).filter(p => {
        // Filtrar filas que tengan al menos nombre (campo más importante)
        return p.name && p.name.trim() !== '';
      });

      setProducts(parsedProducts);
      setSuccess(`✅ ${parsedProducts.length} productos cargados exitosamente`);
      
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Error al cargar:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateWooCommerceCSV = () => {
    if (products.length === 0) {
      setError('Primero carga los productos desde Google Sheets');
      return;
    }

    const headers = [
      'Type',
      'SKU',
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
      const published = p.status === 'publish' ? '1' : '0';

      return [
        'simple',
        p.sku,
        p.name,
        published,
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
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell).replace(/"/g, '""');
        return `"${cellStr}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `izun-woocommerce-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    setSuccess(`✅ CSV descargado: ${products.length} productos exportados`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-emerald-800 mb-2">
                🌿 Convertidor Automático IZUN
              </h1>
              <p className="text-gray-600 text-lg">
                Importación directa desde Google Sheets → WooCommerce CSV
              </p>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 p-5 rounded-lg mt-6">
            <div className="flex">
              <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <h3 className="font-bold text-lg mb-3">📋 Cómo usar esta herramienta:</h3>
                <ol className="list-decimal ml-5 space-y-2">
                  <li><strong>Pega la URL</strong> de tu Google Sheets público (ya está precargada)</li>
                  <li><strong>Haz clic en "Cargar desde Google Sheets"</strong> - Lee automáticamente todos los productos</li>
                  <li><strong>Revisa los productos cargados</strong> en la tabla de abajo</li>
                  <li><strong>Descarga el CSV</strong> listo para WooCommerce</li>
                  <li><strong>Importa en WordPress:</strong> WooCommerce → Productos → Importar</li>
                </ol>
                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800">💡 Ventajas:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>✅ Lee automáticamente hasta 150+ productos</li>
                    <li>✅ SKU único evita duplicados al reimportar</li>
                    <li>✅ Actualiza precios/imágenes sin crear productos nuevos</li>
                    <li>✅ Atributos (Formato, Ingredientes, Posología) incluidos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input y botones */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-3">
            URL de Google Sheets (debe ser público):
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
            <button
              onClick={loadFromGoogleSheets}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Cargar desde Google Sheets
                </>
              )}
            </button>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-700 font-semibold">{success}</p>
            </div>
          )}
        </div>

        {/* Tabla de productos */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-emerald-800">
                📦 Productos Cargados ({products.length})
              </h2>
              <button
                onClick={generateWooCommerceCSV}
                className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-lg font-semibold"
              >
                <Download className="h-5 w-5" />
                Descargar CSV WooCommerce
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-100">
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">SKU</th>
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">Nombre</th>
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">Categoría</th>
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">Precio</th>
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">Peso/Vol</th>
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">Imágenes</th>
                    <th className="border border-emerald-200 px-4 py-3 text-left font-bold text-emerald-900">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="hover:bg-emerald-50 transition">
                      <td className="border border-gray-200 px-4 py-3 font-mono text-sm">{product.sku}</td>
                      <td className="border border-gray-200 px-4 py-3 font-semibold">{product.name}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        {product.subcategory ? `${product.category} > ${product.subcategory}` : product.category}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        {product.price ? (
                          <span className="text-green-600 font-bold">${product.price}</span>
                        ) : (
                          <span className="text-red-500 text-sm">Sin precio</span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">{product.volume || product.weight}</td>
                      <td className="border border-gray-200 px-4 py-3 text-sm">
                        {product.images ? (
                          <span className="text-blue-600">✓ Con imágenes</span>
                        ) : (
                          <span className="text-orange-500">⚠ Sin imágenes</span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.status === 'publish' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status === 'publish' ? 'Publicar' : 'Borrador'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer con tips */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl shadow-xl p-6 text-white">
          <h3 className="font-bold text-lg mb-3">💡 Tips importantes:</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ <strong>Para actualizar productos:</strong> Mantén los mismos SKUs y reimporta el CSV</li>
            <li>✅ <strong>Campos vacíos:</strong> Si faltan precios o imágenes, complétalos en Google Sheets y recarga</li>
            <li>✅ <strong>Nuevos productos:</strong> Agrégalos a Google Sheets con SKU único y recarga</li>
            <li>✅ <strong>Estado "draft":</strong> Los productos no se publican hasta que cambies a "publish"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}