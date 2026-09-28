import Papa from 'papaparse';

const downloadSingleProduct = (selectedData, brand) => {
  const csvHeaders = [
    'Item Name',
    'Item SkuCode',
    'Category Name',
    'Length (cms)',
    'Width (cms)',
    'Height (cms)',
    'Weight (gms)',
    'Last Purchase Price',
    'HSN Code',
    'GST Tax Name',
    'UPC',
    'Critical Inventory',
    'Color',
    'Size',
    'Brand',
    'Shipping Mode',
    'Selling Price',
    'MRP Price',
    'Unit',
    'Image Url',
    'Product Group',
    'Accounting Alias',
    'Model',
    'Inventory Out Mode',
    'Enforce ItemBarcode',
    'Shelf Life',
  ];

  const sizeMapping = {
    XXS: 'XXS',
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL',
    XXL: '2XL',
    XXXL: '3XL',
    XXXXL: '4XL',
    XXXXXL: '5XL',
  };

  const sizes = Object.keys(sizeMapping); // ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "XXXXXL"]

  const csvData = selectedData.flatMap((product) =>
    sizes.map((size) => {
      const mappedSize = sizeMapping[size];

      const getMappedWeight = () => {
        const weight = {
          Coat: 500,
          Jacket: 500,
          Hoodie: 500,
          Dress: 300,
        };
        return weight[product?.styleType] || 250;
      };

      const MAPPED_HSN = {
        Dress: '62044390',
        Top: '62064000',
        Skirt: '62045300',
        Shirt: '62063000',
        Shrug: '61143020',
        Jacket: '62043200',
        Coat: '62043200',
        Sweatshirt: '61102000',
        Palazzo: '62046200',
        Coords: '62046990',
        Jumpsuit: '62114900',
        Cardigan: '61102000',
        Duster: '62042990',
        Tunic: '62064000',
        Kaftan: '62044990',
        Pant: '62046200',
        Shorts: '62046200',
      };

      return {
        'Item Name': product?.styleName?.trim(),
        'Item SkuCode': `${product.styleNumber}-${product.stylePrimaryColor?.trim()}-${mappedSize}`,
        'Category Name': product?.styleType[0]?.toUpperCase() + product?.styleType?.slice(1),
        'Length (cms)': '30',
        'Width (cms)': '30',
        'Height (cms)': '2',
        'Weight (gms)': getMappedWeight(),
        'Last Purchase Price': product?.totalCostINR,
        'HSN Code': MAPPED_HSN[product?.styleType] || '62043300',
        'GST Tax Name': 'GST_5_18',
        UPC: '',
        'Critical Inventory': '',
        Color: product.stylePrimaryColor,
        Size: mappedSize,
        Brand: brand || 'Qurvii',
        'Shipping Mode': '',
        'Selling Price': '',
        'MRP Price': product.mrp,
        Unit: '',
        'Image Url': product?.styleSketchImageLink,
        'Product Group': '',
        'Accounting Alias': '',
        Model: '',
        'Inventory Out Mode': '',
        'Enforce ItemBarcode': '',
        'Shelf Life': '',
      };
    })
  );

  const csv = Papa.unparse({
    fields: csvHeaders,
    data: csvData,
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'BulkCreate_UpdateSimpleProducts.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { downloadSingleProduct };
