// Dữ liệu danh mục + sản phẩm LUXE. Mô tả được viết theo đúng ảnh trong
// frontend/public/images/products/<slug>-<n>.webp (mỗi sản phẩm 1–4 góc chụp).
// Sửa file này rồi chạy: node database/seed/generate.js  => sinh lại database/init/02-seed.sql

const categories = [
  { slug: 'dam-vay', name: 'Đầm & Váy', description: 'Đầm dạ hội, đầm xoè, đầm midi và maxi cho mọi dịp' },
  { slug: 'ao-so-mi', name: 'Áo sơ mi', description: 'Sơ mi caro, flannel và Hawaii cho phái mạnh' },
  { slug: 'tui-xach', name: 'Túi xách', description: 'Túi tote, hobo, satchel, balo da và balo vải' },
  { slug: 'giay-cao-got', name: 'Giày nữ', description: 'Giày cao gót, stiletto, bốt và sandal nữ' },
  { slug: 'sneaker', name: 'Giày nam & Sneaker', description: 'Sneaker, giày lười, giày da lộn và giày đá bóng' },
  { slug: 'dong-ho', name: 'Đồng hồ', description: 'Đồng hồ cơ, chronograph, moonphase và đồng hồ thông minh' },
  { slug: 'kinh-mat', name: 'Kính mắt', description: 'Kính râm aviator, clubmaster và gọng thời trang' },
  { slug: 'trang-suc', name: 'Trang sức', description: 'Bông tai, nhẫn và vòng tay' },
  // Thêm sau — luôn thêm vào CUỐI để không đổi id danh mục đã có
  { slug: 'ao-thun-hoodie', name: 'Áo thun & Hoodie', description: 'Áo thun basic, áo in hình và hoodie nỉ' },
  { slug: 'ao-khoac', name: 'Áo khoác', description: 'Áo khoác kaki, áo da biker, áo gió và áo trượt tuyết' },
  { slug: 'quan', name: 'Quần', description: 'Quần jogger, quần nỉ ống rộng và quần short' },
  { slug: 'mu-non', name: 'Mũ nón', description: 'Mũ lưỡi trai nhiều màu' },
  { slug: 'nuoc-hoa', name: 'Nước hoa', description: 'Nước hoa nam, nữ và unisex' },
  { slug: 'trang-diem', name: 'Trang điểm', description: 'Son môi, mascara, phấn mắt, phấn phủ và sơn móng' },
  { slug: 'cong-nghe', name: 'Phụ kiện công nghệ', description: 'Tai nghe không dây và ốp lưng điện thoại' },
];

const CLOTHING = 'S,M,L,XL';
const DRESS = 'XS,S,M,L';
const MEN_SHOES = '39,40,41,42,43,44';
const WOMEN_SHOES = '35,36,37,38,39';
const UNISEX_SHOES = '36,37,38,39,40,41,42,43';
const RING = '6,7,8,9';

// src = id ảnh gốc (DummyJSON) đã tải về; images = số ảnh của sản phẩm
const products = [
  // ---------------- Đầm & Váy ----------------
  {
    src: 177, images: 4, category: 'dam-vay', slug: 'dam-da-hoi-tre-vai-hoa', name: 'Đầm dạ hội trễ vai họa tiết hoa',
    price: 1890000, original_price: 2290000, sizes: DRESS, color: 'Đen hoa', material: 'Lụa satin in kỹ thuật số',
    gender: 'nu', featured: true, stock: 18, sold: 64,
    description: 'Đầm dạ hội dáng dài chấm gót với phần cúp ngực và dải vai đen trễ vai thanh lịch. Nền đen sâu in hoạ tiết hoa hồng, tím mộng mơ và lá xanh ngọc rực rỡ, chân váy suông rủ mềm tạo dáng cao ráo khi di chuyển.',
    highlights: ['Cổ trễ vai với dải viền đen ôm khít', 'Hoạ tiết hoa nhiều màu trên nền đen', 'Dáng dài chấm gót, chân váy rủ mềm', 'Khoá kéo ẩn sau lưng'],
  },
  {
    src: 178, images: 4, category: 'dam-vay', slug: 'dam-corset-da-do', name: 'Đầm corset da đỏ chân váy dài',
    price: 2150000, sizes: DRESS, color: 'Đỏ', material: 'Da PU bóng mờ',
    gender: 'nu', featured: true, isNew: true, stock: 12, sold: 31,
    description: 'Đầm cúp ngực với phần thân trên kiểu corset bằng da đỏ tươi ôm sát, chia mảnh định hình eo. Chân váy dài cùng tông đỏ rủ thành những nếp gấp tự nhiên, nổi bật cho tiệc tối và sự kiện.',
    highlights: ['Thân trên corset chia mảnh tôn eo', 'Cúp ngực không dây', 'Chân váy dài xếp nếp tự nhiên', 'Tông đỏ đồng bộ toàn thân'],
  },
  {
    src: 179, images: 4, category: 'dam-vay', slug: 'dam-corset-da-den', name: 'Đầm corset da đen dáng dài',
    price: 2150000, sizes: DRESS, color: 'Đen', material: 'Da PU bóng mờ',
    gender: 'nu', stock: 15, sold: 42,
    description: 'Phiên bản đen huyền bí của dòng đầm corset: thân trên cúp ngực bằng da đen ôm dáng, chân váy dài chấm đất rủ nếp mềm. Tối giản, quyền lực và dễ phối cùng trang sức kim loại.',
    highlights: ['Corset cúp ngực ôm dáng', 'Chân váy dài chấm đất', 'Màu đen dễ phối phụ kiện', 'Khoá kéo ẩn phía sau'],
  },
  {
    src: 180, images: 4, category: 'dam-vay', slug: 'dam-xoe-cham-bi-no', name: 'Đầm xoè chấm bi đính nơ retro',
    price: 990000, original_price: 1190000, sizes: DRESS, color: 'Trắng chấm bi đỏ', material: 'Cotton pha, lót tafta',
    gender: 'nu', stock: 26, sold: 88,
    description: 'Đầm cúp ngực nền trắng in chấm bi đỏ nhỏ, viền mép đỏ tinh tế. Nơ bản to cùng chất liệu đính bên eo, chân váy xoè bồng nhiều lớp mang đúng tinh thần retro thập niên 50.',
    highlights: ['Nơ lớn đính eo', 'Chân váy xoè bồng có lót', 'Viền đỏ ở cổ và gấu váy', 'Phong cách vintage thập niên 50'],
  },
  {
    src: 181, images: 4, category: 'dam-vay', slug: 'dam-suong-phoi-mau-color-block', name: 'Đầm suông dài phối màu color-block',
    price: 1250000, sizes: CLOTHING, color: 'Đỏ đô / Đen / Hồng / Trắng', material: 'Crepe co giãn nhẹ',
    gender: 'nu', isNew: true, stock: 20, sold: 17,
    description: 'Đầm suông dáng dài cổ tròn viền cam đào, phối khối màu táo bạo: mặt trước đỏ đô (burgundy), mặt sau đen, một tay hồng fuchsia và một tay trắng kem. Thiết kế mang hơi hướng runway, hợp phong cách cá tính.',
    highlights: ['Phối 4 khối màu bất đối xứng', 'Tay dài hai màu khác nhau', 'Cổ tròn viền cam đào', 'Dáng suông dài qua gối'],
  },
  {
    src: 162, images: 4, category: 'dam-vay', slug: 'dam-xoe-tay-canh-tien-cham-tron', name: 'Đầm xoè tay cánh tiên chấm tròn xanh',
    price: 690000, sizes: DRESS, color: 'Xanh baby', material: 'Cotton lụa',
    gender: 'nu', stock: 35, sold: 120,
    description: 'Đầm xoè ngang gối nền xanh baby in chấm tròn nhiều kích cỡ màu xanh dương và tím lavender. Tay cánh tiên ngắn bồng nhẹ, eo chiết và chân váy xoè rộng cho vẻ ngoài trẻ trung, nữ tính.',
    highlights: ['Tay cánh tiên bồng nhẹ', 'Hoạ tiết chấm tròn xanh – tím', 'Chân váy xoè ngang gối', 'Cổ tròn dễ mặc'],
  },
  {
    src: 163, images: 4, category: 'dam-vay', slug: 'dam-maxi-hai-day-la-co', name: 'Đầm maxi hai dây trễ vai lá cọ',
    price: 790000, sizes: DRESS, color: 'Trắng / Đen', material: 'Voan lụa',
    gender: 'nu', featured: true, stock: 28, sold: 95,
    description: 'Đầm maxi dáng dài suông với dây mảnh và lớp bèo trễ vai nhún nhẹ. Nền trắng in hoạ tiết lá cọ đen đồ hoạ, rất hợp đi biển, du lịch hay dạo phố ngày hè.',
    highlights: ['Hai dây mảnh kết hợp bèo trễ vai', 'Hoạ tiết lá cọ đen trắng', 'Dáng maxi suông thoải mái', 'Chất voan nhẹ, thoáng mát'],
  },
  {
    src: 164, images: 4, category: 'dam-vay', slug: 'dam-midi-sat-nach-be-dinh-cuc', name: 'Đầm midi sát nách màu be đính cúc',
    price: 850000, sizes: CLOTHING, color: 'Be xám', material: 'Linen pha cotton',
    gender: 'nu', stock: 30, sold: 73,
    description: 'Đầm midi sát nách tông be xám trung tính, cổ tròn với hàng cúc nhỏ chạy dọc thân trước. Đai vải rút eo tạo dáng, lưng khoét chữ U nhẹ – lựa chọn thanh lịch cho công sở lẫn cuối tuần.',
    highlights: ['Hàng cúc nhỏ dọc thân trước', 'Đai vải thắt eo', 'Lưng khoét chữ U', 'Chất linen thoáng, đứng form'],
  },
  {
    src: 165, images: 4, category: 'dam-vay', slug: 'dam-cup-nguc-xanh-mint-tang', name: 'Đầm cúp ngực xanh mint tầng bèo',
    price: 920000, original_price: 1090000, sizes: DRESS, color: 'Xanh mint xám', material: 'Cotton twill',
    gender: 'nu', isNew: true, stock: 22, sold: 39,
    description: 'Đầm cúp ngực màu xanh mint pha xám dịu mắt, nơ to thắt ngang eo. Chân váy hai tầng xoè trên gối tạo độ bồng nhẹ nhàng, phù hợp tiệc ngoài trời và dạo phố.',
    highlights: ['Cúp ngực ôm vừa', 'Nơ vải thắt eo', 'Chân váy hai tầng xoè', 'Độ dài trên gối'],
  },
  {
    src: 166, images: 4, category: 'dam-vay', slug: 'dam-caro-tartan-no-satin', name: 'Đầm caro tartan thắt nơ satin đen',
    price: 760000, sizes: DRESS, color: 'Caro đen – trắng – xám', material: 'Cotton dệt caro, đai satin',
    gender: 'nu', stock: 32, sold: 58,
    description: 'Đầm sát nách hoạ tiết caro tartan đen – trắng – xám, phần eo nhấn đai satin đen thắt nơ bản lớn phía sau lưng. Chân váy xoè, cổ tròn – phong cách preppy cổ điển.',
    highlights: ['Caro tartan đơn sắc', 'Đai satin đen thắt nơ lớn', 'Chân váy xoè ngang gối', 'Sát nách, cổ tròn'],
  },

  // ---------------- Áo sơ mi ----------------
  {
    src: 83, images: 4, category: 'ao-so-mi', slug: 'so-mi-caro-gingham-xanh-duong', name: 'Sơ mi caro gingham xanh dương',
    price: 459000, original_price: 540000, sizes: CLOTHING, color: 'Xanh dương / Trắng', material: 'Cotton poplin',
    gender: 'nam', featured: true, stock: 60, sold: 210,
    description: 'Sơ mi nam tay dài kẻ caro gingham phối xanh dương, xanh navy và trắng. Cổ bẻ, nẹp nút giữa, túi ngực trái và măng-sét cài nút – vừa vặn cho đi làm lẫn đi chơi.',
    highlights: ['Caro gingham xanh – trắng', 'Túi ngực trái', 'Măng-sét cài nút', 'Form regular dễ mặc'],
  },
  {
    src: 85, images: 4, category: 'ao-so-mi', slug: 'so-mi-flannel-caro-do-den', name: 'Sơ mi flannel caro đỏ đen',
    price: 529000, sizes: CLOTHING, color: 'Đỏ / Đen', material: 'Flannel cotton chải',
    gender: 'nam', stock: 45, sold: 165,
    description: 'Sơ mi flannel kẻ caro buffalo đỏ – đen to bản đặc trưng phong cách lumberjack. Vải cotton chải dày ấm, cổ bẻ với hàng nút trắng tương phản, có thể mặc như áo khoác nhẹ.',
    highlights: ['Caro buffalo đỏ đen', 'Vải flannel dày, mềm ấm', 'Nút trắng tương phản', 'Mặc riêng hoặc khoác ngoài'],
  },
  {
    src: 86, images: 4, category: 'ao-so-mi', slug: 'so-mi-hawaii-hoa-dam-but', name: 'Sơ mi Hawaii hoạ tiết hoa dâm bụt',
    price: 399000, sizes: CLOTHING, color: 'Xanh cobalt', material: 'Rayon mát',
    gender: 'nam', isNew: true, stock: 50, sold: 98,
    description: 'Sơ mi tay ngắn nền xanh cobalt in hoa dâm bụt trắng xen lá nhiệt đới xanh nhạt. Cổ bẻ thoáng, chất rayon rủ mát – chiếc áo không thể thiếu cho những chuyến đi biển.',
    highlights: ['Hoạ tiết hoa dâm bụt nhiệt đới', 'Tay ngắn, cổ bẻ', 'Rayon mềm, thoáng mát', 'Phong cách resort'],
  },
  {
    src: 87, images: 4, category: 'ao-so-mi', slug: 'so-mi-caro-tartan-xanh-reu', name: 'Sơ mi caro tartan xanh rêu',
    price: 489000, sizes: CLOTHING, color: 'Xanh rêu / Xanh ngọc', material: 'Cotton oxford',
    gender: 'nam', stock: 40, sold: 76,
    description: 'Sơ mi tay dài kẻ caro tartan phối xanh rêu, xám và xanh ngọc nhạt trên nền trắng. Cổ button-down đính nút, măng-sét bo gọn – dễ phối cùng quần chino hoặc jeans.',
    highlights: ['Caro tartan tông xanh lạnh', 'Cổ button-down', 'Cotton oxford bền màu', 'Tay dài, măng-sét cài nút'],
  },

  // ---------------- Túi xách ----------------
  {
    src: 174, images: 3, category: 'tui-xach', slug: 'tui-xach-saffiano-xanh-ngoc', name: 'Túi xách tay da saffiano xanh ngọc',
    price: 2490000, original_price: 2890000, sizes: null, color: 'Xanh ngọc pastel', material: 'Da bò vân saffiano',
    gender: 'nu', featured: true, stock: 10, sold: 47,
    description: 'Túi xách tay dáng thang đứng form màu xanh ngọc pastel, bề mặt da vân saffiano chống xước. Hai quai xách tròn, thẻ tag da treo bên hông và logo tam giác kim loại phía trước.',
    highlights: ['Da vân saffiano chống xước', 'Hai quai xách và thẻ tag treo', 'Dáng thang đứng form', 'Ngăn chính rộng, khoá kéo'],
  },
  {
    src: 173, images: 3, category: 'tui-xach', slug: 'tui-hobo-da-nau-cognac', name: 'Túi hobo da nâu cognac',
    price: 1690000, sizes: null, color: 'Nâu cognac', material: 'Da bò nappa',
    gender: 'nu', stock: 16, sold: 63,
    description: 'Túi hobo dáng mềm màu nâu cognac ấm áp, hai quai cong ôm vai. Mặt trước có ngăn khoá kéo, hai bên hông nhấn phụ kiện kim loại vàng – sang trọng mà vẫn thoải mái hằng ngày.',
    highlights: ['Dáng hobo mềm mại', 'Ngăn khoá kéo mặt trước', 'Phụ kiện kim loại vàng', 'Da nappa mềm tay'],
  },
  {
    src: 176, images: 3, category: 'tui-xach', slug: 'tui-satchel-da-den-dai-khoa', name: 'Túi satchel da đen đai khoá vàng',
    price: 1590000, sizes: null, color: 'Đen', material: 'Da bò trơn',
    gender: 'nu', isNew: true, stock: 18, sold: 52,
    description: 'Túi satchel đen dáng hộp với hai quai xách, mặt trước nhấn đai da ngang cùng khoá kim loại vàng. Hai bên hông gấp xếp kiểu accordion giúp túi mở rộng, đựng vừa laptop 13 inch.',
    highlights: ['Đai da khoá vàng mặt trước', 'Hông gấp xếp mở rộng', 'Dáng hộp đứng form', 'Vừa laptop 13 inch'],
  },
  {
    src: 172, images: 3, category: 'tui-xach', slug: 'tui-tote-da-xanh-navy', name: 'Túi tote da xanh navy',
    price: 1450000, sizes: null, color: 'Xanh navy', material: 'Da bò trơn',
    gender: 'nu', stock: 20, sold: 44,
    description: 'Túi tote dáng chữ nhật đứng form màu xanh navy đậm, hai quai xách tròn chắc chắn. Thân túi chia mảnh với đường chỉ nổi dọc thân, tối giản và thanh lịch cho dân công sở.',
    highlights: ['Dáng tote chữ nhật', 'Đường chỉ nổi dọc thân', 'Quai tròn chắc chắn', 'Màu navy dễ phối đồ'],
  },
  {
    src: 175, images: 3, category: 'tui-xach', slug: 'balo-da-trang-nap-gap', name: 'Balo da trắng nắp gập dây rút',
    price: 890000, sizes: null, color: 'Trắng', material: 'Da PU cao cấp',
    gender: 'nu', stock: 25, sold: 81,
    description: 'Balo mini màu trắng tinh với nắp gập trang trí thanh kim loại vàng, miệng túi dây rút. Hai quai đeo vai điều chỉnh độ dài bằng khoá kim loại, quai xách nhỏ phía trên tiện lợi.',
    highlights: ['Nắp gập viền kim loại vàng', 'Miệng túi dây rút', 'Quai đeo điều chỉnh được', 'Kích thước mini gọn nhẹ'],
  },

  // ---------------- Giày cao gót ----------------
  {
    src: 188, images: 4, category: 'giay-cao-got', slug: 'giay-stiletto-da-bong-den', name: 'Giày stiletto da bóng đen đế đỏ',
    price: 1390000, sizes: WOMEN_SHOES, color: 'Đen', material: 'Da bóng, lót da',
    gender: 'nu', featured: true, stock: 22, sold: 140,
    description: 'Giày stiletto mũi nhọn bằng da bóng đen, gót nhọn 12cm thanh mảnh. Lót trong màu nude, đế ngoài đỏ nổi bật – món đồ kinh điển cho những buổi tiệc tối.',
    highlights: ['Gót nhọn 12cm', 'Mũi nhọn thon dài', 'Đế ngoài màu đỏ', 'Lót da nude êm chân'],
  },
  {
    src: 187, images: 4, category: 'giay-cao-got', slug: 'giay-cao-got-anh-kim-champagne', name: 'Giày cao gót ánh kim champagne',
    price: 1150000, original_price: 1350000, sizes: WOMEN_SHOES, color: 'Vàng champagne', material: 'Da ánh kim',
    gender: 'nu', isNew: true, stock: 18, sold: 56,
    description: 'Giày pump mũi nhọn phủ da ánh kim vàng champagne lấp lánh, gót stiletto 10cm. Đế ngoài màu đỏ, đường cắt thân giày thấp khoe mu bàn chân thon gọn.',
    highlights: ['Da ánh kim vàng champagne', 'Gót stiletto 10cm', 'Đế ngoài đỏ', 'Cổ giày khoét thấp'],
  },
  {
    src: 186, images: 4, category: 'giay-cao-got', slug: 'sandal-cao-got-quai-ban-to', name: 'Sandal cao gót quai bản to đen',
    price: 1290000, sizes: WOMEN_SHOES, color: 'Đen', material: 'Da bóng',
    gender: 'nu', stock: 15, sold: 37,
    description: 'Sandal cao gót mũi hở với quai ngang bản rộng phía trước và quai cổ chân dạng ống in chữ trắng. Da bóng đen, gót nhọn 10cm – hiện đại, cá tính.',
    highlights: ['Quai ngang bản to', 'Quai cổ chân dạng ống', 'Gót nhọn 10cm', 'Mũi hở thoáng'],
  },
  {
    src: 185, images: 4, category: 'giay-cao-got', slug: 'giay-pump-mui-nhon-da-den', name: 'Giày pump mũi nhọn da đen mờ',
    price: 890000, sizes: WOMEN_SHOES, color: 'Đen', material: 'Da bò mờ, lót da nâu',
    gender: 'nu', stock: 30, sold: 155,
    description: 'Giày pump công sở da đen mờ mũi nhọn, gót nhọn 9cm vừa phải. Lót trong da nâu cognac êm chân, thiết kế trơn tối giản đi cùng mọi trang phục.',
    highlights: ['Da đen mờ sang trọng', 'Gót 9cm dễ đi', 'Lót da nâu cognac', 'Phù hợp công sở'],
  },
  {
    src: 189, images: 4, category: 'giay-cao-got', slug: 'giay-cao-got-satin-do', name: 'Giày cao gót satin đỏ cherry',
    price: 950000, sizes: WOMEN_SHOES, color: 'Đỏ cherry', material: 'Satin bóng',
    gender: 'nu', stock: 20, sold: 67,
    description: 'Giày cao gót bọc satin đỏ cherry bóng mượt, mũi nhọn bo nhẹ và gót nhọn 8cm. Gam đỏ rực điểm nhấn cho trang phục đen hoặc trắng.',
    highlights: ['Satin đỏ cherry bóng', 'Gót 8cm vừa phải', 'Mũi nhọn bo nhẹ', 'Lót đệm êm'],
  },

  // ---------------- Sneaker ----------------
  {
    src: 88, images: 4, category: 'sneaker', slug: 'sneaker-co-cao-do-trang-den', name: 'Sneaker cổ cao đỏ – trắng – đen',
    price: 2890000, sizes: MEN_SHOES, color: 'Đỏ / Trắng / Đen', material: 'Da bò, đế cao su',
    gender: 'unisex', featured: true, stock: 25, sold: 230,
    description: 'Sneaker cổ cao phong cách bóng rổ cổ điển: mũi và gót da đỏ, thân trắng, logo đen bên hông, cổ giày và dây đen. Mảng da đỏ phía sau chần trám tạo điểm nhấn.',
    highlights: ['Cổ cao ôm mắt cá', 'Phối màu đỏ – trắng – đen', 'Da chần trám ở gót', 'Đế cao su bám tốt'],
  },
  {
    src: 91, images: 4, category: 'sneaker', slug: 'sneaker-co-thap-mui-ten-do', name: 'Sneaker cổ thấp hoạ tiết mũi tên đỏ',
    price: 2390000, original_price: 2690000, sizes: MEN_SHOES, color: 'Trắng kem / Đỏ', material: 'Da bò, đế cao su',
    gender: 'unisex', isNew: true, stock: 20, sold: 112,
    description: 'Sneaker cổ thấp da trắng kem, nổi bật hoạ tiết mũi tên đỏ bên hông. Gót và lót cổ giày màu đỏ, viền đế đỏ – phong cách streetwear dễ phối.',
    highlights: ['Mũi tên đỏ bên hông', 'Gót và lót cổ màu đỏ', 'Da trắng kem dễ vệ sinh', 'Đế cao su viền đỏ'],
  },
  {
    src: 90, images: 4, category: 'sneaker', slug: 'sneaker-retro-runner-phoi-mau', name: 'Sneaker retro runner phối màu',
    price: 1790000, sizes: MEN_SHOES, color: 'Xanh / Đỏ / Vàng', material: 'Lưới, da lộn, đế EVA',
    gender: 'unisex', stock: 30, sold: 97,
    description: 'Sneaker chạy bộ phong cách retro thập niên 80 với các mảng xanh dương, đỏ, vàng chanh và kem. Đế bánh mì trắng có rãnh, dây trắng, lớp lưới thoáng khí.',
    highlights: ['Phối màu retro rực rỡ', 'Đế EVA nhẹ, êm', 'Mũ giày lưới thoáng khí', 'Phong cách chạy bộ cổ điển'],
  },
  {
    src: 89, images: 4, category: 'sneaker', slug: 'giay-dinh-bong-chay-trang-xanh', name: 'Giày đinh bóng chày trắng – xanh rêu',
    price: 1990000, sizes: MEN_SHOES, color: 'Trắng / Xanh rêu', material: 'Da tổng hợp, đế đinh kim loại',
    gender: 'nam', stock: 14, sold: 28,
    description: 'Giày thể thao cổ lửng thân trắng phối da xanh lục đậm, logo bên hông. Đế đinh kim loại bám sân cỏ, lưỡi gà đệm dày – dành cho bóng chày và các môn sân cỏ.',
    highlights: ['Đế đinh kim loại bám sân', 'Cổ lửng ổn định mắt cá', 'Phối trắng – xanh rêu', 'Lưỡi gà đệm dày'],
  },

  // ---------------- Đồng hồ ----------------
  {
    src: 98, images: 3, category: 'dong-ho', slug: 'dong-ho-lan-mat-den-vanh-xoay', name: 'Đồng hồ lặn mặt đen vành xoay',
    price: 11900000, original_price: 13500000, sizes: null, color: 'Đen / Demi vàng', material: 'Thép 316L, kính sapphire',
    gender: 'nam', featured: true, stock: 8, sold: 23,
    description: 'Đồng hồ lặn mặt đen với vành xoay một chiều chia phút, cọc số dạ quang và lịch ngày có mắt lens phóng to ở vị trí 3 giờ. Dây kim loại phối demi vàng – thép, chống nước 200m.',
    highlights: ['Vành xoay chia phút', 'Cọc số dạ quang', 'Lịch ngày có lens phóng đại', 'Chống nước 200m'],
  },
  {
    src: 96, images: 3, category: 'dong-ho', slug: 'dong-ho-moonphase-mat-trang-vang-hong', name: 'Đồng hồ moonphase mặt trắng vỏ vàng hồng',
    price: 9500000, sizes: null, color: 'Vàng hồng / Nâu', material: 'Thép mạ vàng hồng, dây da bê',
    gender: 'nam', isNew: true, stock: 9, sold: 19,
    description: 'Mặt số trắng ngà tinh tế với đĩa lịch tuần trăng xanh lapis ở vị trí 6 giờ, kim và cọc vàng hồng. Vỏ vàng hồng bóng, dây da nâu sẫm chỉ khâu trắng.',
    highlights: ['Lịch tuần trăng (moonphase)', 'Vỏ vàng hồng bóng', 'Dây da nâu chỉ trắng', 'Máy cơ automatic'],
  },
  {
    src: 93, images: 3, category: 'dong-ho', slug: 'dong-ho-chronograph-vo-vang-day-da', name: 'Đồng hồ chronograph vỏ vàng dây da nâu',
    price: 8900000, sizes: null, color: 'Vàng / Nâu', material: 'Thép mạ vàng, dây da vân cá sấu',
    gender: 'nam', stock: 11, sold: 34,
    description: 'Chronograph mặt trắng với số Ả Rập, kim xanh blued cổ điển, ba mặt phụ và lịch tuần trăng. Vỏ vàng, dây da nâu vân cá sấu với khoá gập triển khai.',
    highlights: ['Ba mặt phụ chronograph', 'Kim xanh blued', 'Dây da vân cá sấu', 'Khoá gập triển khai'],
  },
  {
    src: 94, images: 3, category: 'dong-ho', slug: 'dong-ho-chronograph-mat-den-day-thep', name: 'Đồng hồ chronograph mặt đen dây thép',
    price: 8500000, sizes: null, color: 'Bạc / Đen', material: 'Thép không gỉ 316L',
    gender: 'nam', stock: 12, sold: 29,
    description: 'Mặt số đen số La Mã kèm cửa sổ thứ – tháng và lịch tuần trăng, ba mặt phụ chronograph. Vỏ và dây thép không gỉ mắt xích, khoá bướm chắc chắn.',
    highlights: ['Cửa sổ thứ và tháng', 'Số La Mã cổ điển', 'Dây thép mắt xích', 'Khoá bướm an toàn'],
  },
  {
    src: 97, images: 3, category: 'dong-ho', slug: 'dong-ho-demi-vanh-khia-mat-xam', name: 'Đồng hồ demi vành khía mặt xám',
    price: 10500000, sizes: null, color: 'Demi vàng – thép / Xám', material: 'Thép 316L mạ vàng',
    gender: 'unisex', featured: true, stock: 10, sold: 41,
    description: 'Vành khía (fluted) vàng ôm mặt số xám than với cọc số La Mã và lịch ngày ở vị trí 3 giờ. Dây jubilee 5 hàng mắt phối vàng và thép – biểu tượng thanh lịch vượt thời gian.',
    highlights: ['Vành khía fluted mạ vàng', 'Dây jubilee demi', 'Lịch ngày vị trí 3 giờ', 'Hợp cả nam và nữ'],
  },
  {
    src: 95, images: 3, category: 'dong-ho', slug: 'dong-ho-vo-vang-hong-mat-den', name: 'Đồng hồ vỏ vàng hồng mặt đen dây da',
    price: 7900000, sizes: null, color: 'Vàng hồng / Đen', material: 'Thép mạ vàng hồng, dây da bê',
    gender: 'nam', stock: 13, sold: 22,
    description: 'Mặt số đen sâu với kim và cọc vàng hồng, mặt phụ hiển thị ngày bên phải. Vỏ vàng hồng dáng tròn cổ điển, dây da đen lót da sáng màu.',
    highlights: ['Mặt đen kim vàng hồng', 'Mặt phụ hiển thị ngày', 'Dây da đen lót sáng', 'Vỏ tròn cổ điển'],
  },
  {
    src: 190, images: 3, category: 'dong-ho', slug: 'dong-ho-automatic-thep-mat-den', name: 'Đồng hồ automatic thép mặt đen',
    price: 6900000, sizes: null, color: 'Bạc / Đen', material: 'Thép không gỉ chải xước',
    gender: 'unisex', stock: 15, sold: 38,
    description: 'Đồng hồ automatic vỏ và dây thép bạc chải xước, mặt đen với cọc vạch dạ quang và kim lá thanh mảnh. Thiết kế thể thao – thanh lịch, đeo được mọi hoàn cảnh.',
    highlights: ['Máy automatic', 'Cọc vạch dạ quang', 'Thép chải xước', 'Dây mắt xích 3 hàng'],
  },
  {
    src: 193, images: 3, category: 'dong-ho', slug: 'dong-ho-nu-mat-xanh-day-vang', name: 'Đồng hồ nữ mặt xanh dây kim loại vàng',
    price: 3900000, original_price: 4500000, sizes: null, color: 'Vàng / Xanh navy', material: 'Thép mạ vàng PVD',
    gender: 'nu', isNew: true, stock: 20, sold: 46,
    description: 'Mặt số xanh navy với cọc số La Mã và kim giây đỏ nổi bật. Vỏ và dây mắt xích mạ vàng PVD bền màu – món phụ kiện nữ tính và sang trọng.',
    highlights: ['Mặt xanh navy số La Mã', 'Kim giây màu đỏ', 'Mạ vàng PVD bền màu', 'Máy quartz chính xác'],
  },
  {
    src: 194, images: 2, category: 'dong-ho', slug: 'dong-ho-toi-gian-mat-den', name: 'Đồng hồ tối giản mặt đen dây thép',
    price: 2900000, sizes: null, color: 'Bạc / Đen', material: 'Thép không gỉ',
    gender: 'unisex', stock: 25, sold: 64,
    description: 'Mặt số đen trơn tối giản với cọc vạch mảnh và lịch ngày ở vị trí 6 giờ. Vỏ và dây thép mắt xích 5 hàng sáng bóng, mỏng nhẹ khi đeo.',
    highlights: ['Thiết kế tối giản', 'Lịch ngày vị trí 6 giờ', 'Dây thép 5 hàng mắt', 'Vỏ mỏng nhẹ'],
  },

  // ---------------- Kính mắt ----------------
  {
    src: 154, images: 3, category: 'kinh-mat', slug: 'kinh-clubmaster-doi-moi', name: 'Kính râm clubmaster đồi mồi',
    price: 590000, sizes: null, color: 'Đồi mồi / Vàng', material: 'Acetate, kim loại',
    gender: 'unisex', featured: true, stock: 40, sold: 175,
    description: 'Kính clubmaster với viền trên nhựa vân đồi mồi nâu, nửa dưới gọng kim loại vàng mảnh. Tròng xanh rêu G-15 chống tia UV400, giữ màu sắc tự nhiên.',
    highlights: ['Viền trên vân đồi mồi', 'Gọng dưới kim loại vàng', 'Tròng xanh rêu G-15', 'Chống UV400'],
  },
  {
    src: 155, images: 3, category: 'kinh-mat', slug: 'kinh-phi-cong-trong-gradient-xanh', name: 'Kính phi công tròng gradient xanh',
    price: 650000, sizes: null, color: 'Vàng / Xanh khói', material: 'Kim loại, tròng polycarbonate',
    gender: 'unisex', stock: 35, sold: 132,
    description: 'Kính aviator gọng kim loại vàng mảnh với cầu đôi kinh điển. Tròng giọt nước gradient xanh khói nhạt dần từ trên xuống, chống UV400.',
    highlights: ['Dáng aviator giọt nước', 'Cầu đôi kim loại', 'Tròng gradient xanh khói', 'Chống UV400'],
  },
  {
    src: 156, images: 3, category: 'kinh-mat', slug: 'kinh-phi-cong-trong-xanh-la', name: 'Kính phi công tròng xanh lá',
    price: 620000, sizes: null, color: 'Đen / Xanh lá', material: 'Kim loại, tròng polycarbonate',
    gender: 'unisex', isNew: true, stock: 30, sold: 54,
    description: 'Kính gọng kim loại đen cầu đôi, tròng lục giác bo góc màu xanh ngọc lá trong trẻo. Biến thể hiện đại của dáng phi công, nhẹ và thời thượng.',
    highlights: ['Tròng xanh lá trong', 'Gọng kim loại đen', 'Dáng lục giác bo góc', 'Siêu nhẹ'],
  },
  {
    src: 158, images: 3, category: 'kinh-mat', slug: 'kinh-gong-trong-suot-oversize', name: 'Kính gọng trong suốt oversize',
    price: 520000, sizes: null, color: 'Trong suốt', material: 'Acetate trong',
    gender: 'unisex', stock: 28, sold: 61,
    description: 'Kính gọng acetate trong suốt to bản, dáng vuông với cạnh vát góc cá tính. Đinh tán vàng ở bản lề, tròng trong suốt – có thể thay tròng cận.',
    highlights: ['Gọng acetate trong suốt', 'Dáng oversize cạnh vát', 'Đinh tán vàng bản lề', 'Lắp được tròng cận'],
  },
  {
    src: 157, images: 3, category: 'kinh-mat', slug: 'kinh-pixel-8-bit', name: 'Kính pixel 8-bit tròng hồng',
    price: 190000, sizes: null, color: 'Đen / Hồng', material: 'Nhựa ABS',
    gender: 'unisex', stock: 60, sold: 210,
    description: 'Kính party gọng nhựa đen tạo hình pixel 8-bit, tròng hồng điểm ô pixel trắng. Món phụ kiện vui nhộn cho tiệc tùng, chụp ảnh và lễ hội.',
    highlights: ['Hình pixel 8-bit vui nhộn', 'Tròng hồng có ô pixel', 'Nhựa ABS siêu nhẹ', 'Phụ kiện tiệc & chụp ảnh'],
  },

  // ---------------- Trang sức ----------------
  {
    src: 182, images: 3, category: 'trang-suc', slug: 'bong-tai-giot-pha-le-xanh-luc', name: 'Bông tai giọt pha lê xanh lục bảo',
    price: 690000, sizes: null, color: 'Xanh lục / Vàng', material: 'Đồng mạ vàng 18K, pha lê',
    gender: 'nu', featured: true, stock: 30, sold: 88,
    description: 'Bông tai móc khoá chữ U mạ vàng, đính đá tròn xanh lục nhỏ, nối chụp vàng với mặt pha lê giọt nước giác cắt xanh lục bảo lấp lánh.',
    highlights: ['Pha lê giọt nước giác cắt', 'Móc khoá chữ U an toàn', 'Mạ vàng 18K', 'Hợp dự tiệc'],
  },
  {
    src: 183, images: 3, category: 'trang-suc', slug: 'bong-tai-vong-tron-caro-xanh', name: 'Bông tai vòng tròn caro xanh – kem',
    price: 290000, sizes: null, color: 'Xanh ngọc / Kem', material: 'Acrylic, chốt bạc 925',
    gender: 'nu', isNew: true, stock: 45, sold: 70,
    description: 'Khuyên nụ tròn màu xanh ngọc treo mặt vòng tròn rỗng hoạ tiết caro gợn sóng xanh ngọc – kem. Chất liệu acrylic siêu nhẹ, chốt bạc 925 không gây kích ứng.',
    highlights: ['Hoạ tiết caro gợn sóng', 'Acrylic siêu nhẹ', 'Chốt bạc 925', 'Phong cách retro'],
  },
  {
    src: 184, images: 3, category: 'trang-suc', slug: 'bong-tai-la-monstera-vang', name: 'Bông tai lá monstera vàng nghệ',
    price: 320000, sizes: null, color: 'Vàng nghệ', material: 'Acrylic, khuyên kim loại mạ vàng',
    gender: 'nu', stock: 40, sold: 58,
    description: 'Khuyên nụ tròn kim loại vàng treo mặt lá monstera tạo hình bằng acrylic vàng nghệ. Thiết kế nhiệt đới nổi bật, nhẹ tai khi đeo cả ngày.',
    highlights: ['Tạo hình lá monstera', 'Màu vàng nghệ ấm', 'Khuyên nụ mạ vàng', 'Nhẹ, đeo cả ngày'],
  },
];

// ======================================================================
//  55 sản phẩm thêm sau (id 46 → 100). src dạng chuỗi = mã ảnh gốc đã tải:
//  p<id> = Platzi Fake Store, f<id> = Fake Store API, d<id> = DummyJSON.
//  Luôn thêm vào CUỐI mảng để id các sản phẩm cũ (và đơn hàng đã có) không đổi.
// ======================================================================
products.push(
  // ---------------- Áo thun & Hoodie ----------------
  {
    src: 'p1', images: 1, category: 'ao-thun-hoodie', slug: 'ao-thun-den-in-hinh-nui-tuyet', name: 'Áo thun đen in hình núi tuyết',
    price: 350000, sizes: CLOTHING, color: 'Đen', material: 'Cotton 100%',
    gender: 'unisex', isNew: true, stock: 60, sold: 85,
    description: 'Áo thun cổ tròn màu đen, mặt trước in khối lớn hình dãy núi tuyết đơn sắc trắng – xám đầy chiều sâu. Form suông vừa, chất cotton dày dặn, mặc riêng hay khoác ngoài đều đẹp.',
    highlights: ['Hình in dãy núi tuyết khổ lớn', 'Cổ tròn bo dày, giữ form', 'Cotton 100% thấm hút tốt', 'Unisex, form suông'],
  },
  {
    src: 'p2', images: 3, category: 'ao-thun-hoodie', slug: 'ao-hoodie-do-lot-mu-xam', name: 'Áo hoodie đỏ lót mũ xám',
    price: 590000, original_price: 690000, sizes: CLOTHING, color: 'Đỏ / Xám', material: 'Nỉ bông cotton',
    gender: 'unisex', featured: true, stock: 40, sold: 132,
    description: 'Hoodie màu đỏ tươi với lớp lót mũ xám melange tương phản, dây rút xám đầu kim loại và chi tiết khoá kéo nhỏ ở cổ. Túi kangaroo phía trước, bo tay và gấu áo dệt gân ôm gọn.',
    highlights: ['Lót mũ xám melange tương phản', 'Dây rút xám đầu kim loại', 'Túi kangaroo phía trước', 'Nỉ bông giữ ấm'],
  },
  {
    src: 'p3', images: 3, category: 'ao-thun-hoodie', slug: 'ao-hoodie-xam-nhat', name: 'Áo hoodie xám nhạt dây rút kem',
    price: 550000, sizes: CLOTHING, color: 'Xám nhạt', material: 'Nỉ bông cotton',
    gender: 'unisex', stock: 45, sold: 98,
    description: 'Hoodie xám melange nhạt tối giản, mũ hai lớp với dây rút màu kem buông dài. Túi kangaroo rộng, bo tay và gấu dệt gân – món đồ basic dễ phối cho mùa lạnh.',
    highlights: ['Màu xám melange dễ phối', 'Mũ hai lớp đứng form', 'Dây rút màu kem', 'Túi kangaroo rộng'],
  },
  {
    src: 'p4', images: 3, category: 'ao-thun-hoodie', slug: 'ao-hoodie-xam-chi', name: 'Áo hoodie xám chì dây rút trắng',
    price: 550000, sizes: CLOTHING, color: 'Xám chì', material: 'Nỉ bông cotton',
    gender: 'unisex', stock: 42, sold: 76,
    description: 'Hoodie màu xám chì trầm, dây rút trắng nổi bật trên nền vải. Mũ trùm rộng, túi kangaroo và bo tay ôm cổ tay – mặc đi học, đi chơi hay tập luyện đều hợp.',
    highlights: ['Xám chì trầm, ít lộ bẩn', 'Dây rút trắng tương phản', 'Túi kangaroo', 'Bo tay và gấu dệt gân'],
  },
  {
    src: 'p5', images: 3, category: 'ao-thun-hoodie', slug: 'ao-hoodie-den-tron', name: 'Áo hoodie đen trơn',
    price: 550000, sizes: CLOTHING, color: 'Đen', material: 'Nỉ bông cotton',
    gender: 'unisex', featured: true, stock: 55, sold: 160,
    description: 'Hoodie đen trơn với dây rút cùng màu, form suông thoải mái. Phối cùng quần jogger xám và sneaker trắng như ảnh là có ngay outfit đường phố gọn gàng.',
    highlights: ['Đen trơn tối giản', 'Dây rút cùng màu', 'Túi kangaroo', 'Form suông unisex'],
  },
  {
    src: 'p15', images: 3, category: 'ao-thun-hoodie', slug: 'ao-thun-trang-co-tron-nu', name: 'Áo thun trắng cổ tròn dáng ôm nữ',
    price: 250000, sizes: 'XS,S,M,L', color: 'Trắng', material: 'Cotton co giãn',
    gender: 'nu', stock: 80, sold: 210,
    description: 'Áo thun trắng cổ tròn dáng ôm nhẹ, tay ngắn vừa phải, đường may bo cổ mảnh tinh tế. Chất cotton co giãn mềm mịn – item cơ bản phối được với mọi loại quần và chân váy.',
    highlights: ['Dáng ôm nhẹ tôn dáng', 'Bo cổ mảnh tinh tế', 'Cotton co giãn 4 chiều', 'Dễ phối mọi trang phục'],
  },
  {
    src: 'p16', images: 3, category: 'ao-thun-hoodie', slug: 'ao-thun-trang-basic-nam', name: 'Áo thun trắng basic nam',
    price: 250000, sizes: CLOTHING, color: 'Trắng', material: 'Cotton 100%',
    gender: 'nam', stock: 90, sold: 245,
    description: 'Áo thun trắng cổ tròn form regular dành cho nam, vai và tay áo vừa vặn, bo cổ dày không bai. Một chiếc áo không thể thiếu trong tủ đồ hằng ngày.',
    highlights: ['Form regular vừa vặn', 'Bo cổ dày không bai', 'Cotton 100% thoáng mát', 'Màu trắng tinh'],
  },
  {
    src: 'p17', images: 3, category: 'ao-thun-hoodie', slug: 'ao-thun-den-basic', name: 'Áo thun đen basic cổ tròn',
    price: 250000, sizes: CLOTHING, color: 'Đen', material: 'Cotton 100%',
    gender: 'unisex', stock: 85, sold: 230,
    description: 'Áo thun đen trơn cổ tròn, tay ngắn, form suông nhẹ. Chất cotton dày vừa, giữ màu đen sâu sau nhiều lần giặt – nền tảng cho mọi outfit tối giản.',
    highlights: ['Đen trơn giữ màu lâu', 'Cổ tròn bo gân', 'Form suông nhẹ', 'Unisex'],
  },
  {
    src: 'f2', images: 1, category: 'ao-thun-hoodie', slug: 'ao-henley-raglan-tay-lung', name: 'Áo Henley raglan tay lửng',
    price: 320000, sizes: CLOTHING, color: 'Xám / Đen', material: 'Cotton pha',
    gender: 'nam', stock: 50, sold: 64,
    description: 'Áo Henley thân xám melange phối tay raglan màu đen dài ba phần tư, nẹp cổ ba khuy đen. Form slim fit gọn gàng, phong cách bóng chày cổ điển.',
    highlights: ['Tay raglan đen tương phản', 'Cổ Henley 3 khuy', 'Tay lửng 3/4', 'Form slim fit'],
  },
  {
    src: 'f4', images: 1, category: 'ao-thun-hoodie', slug: 'ao-thun-dai-tay-co-tim-xanh', name: 'Áo thun dài tay cổ tim xanh denim',
    price: 290000, sizes: CLOTHING, color: 'Xanh denim', material: 'Cotton co giãn',
    gender: 'nam', stock: 48, sold: 57,
    description: 'Áo thun dài tay cổ tim màu xanh denim nhạt, form slim ôm vừa người. Mặc riêng hoặc làm lớp lót bên trong áo khoác đều lịch sự.',
    highlights: ['Cổ tim thanh lịch', 'Dài tay, form slim', 'Màu xanh denim nhạt', 'Vải co giãn thoải mái'],
  },
  {
    src: 'f18', images: 1, category: 'ao-thun-hoodie', slug: 'ao-thun-nu-co-thuyen-trang', name: 'Áo thun nữ cổ thuyền trắng',
    price: 230000, sizes: 'S,M,L', color: 'Trắng', material: 'Cotton pha spandex',
    gender: 'nu', stock: 60, sold: 88,
    description: 'Áo thun nữ màu trắng cổ thuyền rộng, tay ngắn kiểu cánh dơi, hai bên sườn nhún nhẹ tạo độ rủ mềm mại. Thoáng mát, nữ tính cho ngày hè.',
    highlights: ['Cổ thuyền rộng', 'Tay cánh dơi ngắn', 'Nhún sườn tạo độ rủ', 'Chất vải mềm, co giãn'],
  },
  {
    src: 'f19', images: 1, category: 'ao-thun-hoodie', slug: 'ao-thun-nu-co-tim-do', name: 'Áo thun nữ cổ tim đỏ',
    price: 220000, sizes: 'S,M,L', color: 'Đỏ', material: 'Polyester thấm hút',
    gender: 'nu', stock: 70, sold: 73,
    description: 'Áo thun nữ màu đỏ tươi cổ tim, tay ngắn, chất vải polyester thấm hút mồ hôi nhanh khô – hợp đi tập, chạy bộ hay mặc hằng ngày.',
    highlights: ['Cổ tim', 'Thấm hút, nhanh khô', 'Màu đỏ tươi', 'Hợp tập luyện'],
  },
  {
    src: 'f20', images: 1, category: 'ao-thun-hoodie', slug: 'ao-thun-nu-tim-in-chu-be-kind', name: 'Áo thun nữ tím in chữ "be kind"',
    price: 240000, sizes: 'S,M,L', color: 'Tím', material: 'Cotton',
    gender: 'nu', isNew: true, stock: 55, sold: 49,
    description: 'Áo thun nữ màu tím mận cổ tim, mặt trước in chữ viết tay "be kind" màu trắng kèm hình trái tim nhỏ, vạt trước thắt nút tạo điểm nhấn trẻ trung.',
    highlights: ['In chữ "be kind" viết tay', 'Cổ tim', 'Vạt trước thắt nút', 'Màu tím mận'],
  },

  // ---------------- Áo khoác ----------------
  {
    src: 'f3', images: 1, category: 'ao-khoac', slug: 'ao-khoac-kaki-nam-mau-be', name: 'Áo khoác kaki nam màu be',
    price: 890000, original_price: 1090000, sizes: CLOTHING, color: 'Be', material: 'Kaki cotton',
    gender: 'nam', featured: true, stock: 30, sold: 67,
    description: 'Áo khoác kaki màu be cổ đứng, cài khoá kéo kết hợp hàng cúc bấm, nhiều túi hộp có nắp phía trước và cầu vai đính cúc. Phong cách field jacket mạnh mẽ cho mùa thu.',
    highlights: ['Cổ đứng, khoá kéo + cúc bấm', 'Nhiều túi hộp có nắp', 'Cầu vai đính cúc', 'Kaki cotton bền chắc'],
  },
  {
    src: 'f15', images: 1, category: 'ao-khoac', slug: 'ao-khoac-truot-tuyet-nu-tim', name: 'Áo khoác trượt tuyết nữ 3 trong 1 tím',
    price: 1290000, original_price: 1590000, sizes: 'S,M,L', color: 'Tím', material: 'Vải gió chống nước, lót nỉ',
    gender: 'nu', stock: 20, sold: 31,
    description: 'Áo khoác nữ màu tím đậm có mũ trùm, khoá kéo hai lớp và lớp lót bên trong tháo rời được – mặc riêng lớp ngoài, lớp lót hoặc cả hai tuỳ thời tiết. Vải ngoài cản gió, chống nước nhẹ.',
    highlights: ['3 trong 1: lớp ngoài + lót tháo rời', 'Mũ trùm chắn gió', 'Chống nước nhẹ', 'Nhiều túi khoá kéo'],
  },
  {
    src: 'f16', images: 1, category: 'ao-khoac', slug: 'ao-khoac-da-biker-nu-co-mu', name: 'Áo khoác da biker nữ có mũ',
    price: 1150000, sizes: 'S,M,L', color: 'Đen', material: 'Da PU, mũ nỉ',
    gender: 'nu', isNew: true, stock: 25, sold: 44,
    description: 'Áo khoác da biker nữ màu đen dáng ngắn, khoá kéo lệch, kèm mũ trùm vải nỉ tháo rời. Cá tính, dễ phối cùng quần jean và bốt.',
    highlights: ['Dáng biker ngắn', 'Mũ nỉ tháo rời', 'Da PU mềm, bóng nhẹ', 'Túi khoá kéo hai bên'],
  },
  {
    src: 'f17', images: 1, category: 'ao-khoac', slug: 'ao-khoac-gio-nu-xanh-navy', name: 'Áo khoác gió nữ xanh navy',
    price: 690000, sizes: 'S,M,L', color: 'Xanh navy', material: 'Vải gió chống nước',
    gender: 'nu', stock: 35, sold: 52,
    description: 'Áo khoác gió nữ màu xanh navy dáng dài qua hông, cổ đứng cài khoá kéo, tay áo gập lộ lớp lót kẻ sọc. Nhẹ, cản gió và chống nước nhẹ khi đi mưa phùn.',
    highlights: ['Dáng dài qua hông', 'Lót kẻ sọc ở tay', 'Cản gió, chống nước nhẹ', 'Siêu nhẹ, dễ gấp gọn'],
  },

  // ---------------- Quần ----------------
  {
    src: 'p6', images: 3, category: 'quan', slug: 'quan-jogger-den-bo-gau', name: 'Quần jogger đen bo gấu',
    price: 420000, sizes: CLOTHING, color: 'Đen', material: 'Nỉ da cá',
    gender: 'unisex', stock: 60, sold: 140,
    description: 'Quần jogger đen cạp chun có dây rút trắng, hai túi chéo và gấu bo gọn ở cổ chân. Chất nỉ da cá mềm, co giãn – mặc ở nhà, đi tập hay dạo phố đều thoải mái.',
    highlights: ['Cạp chun dây rút', 'Gấu bo cổ chân', 'Hai túi chéo', 'Nỉ da cá co giãn'],
  },
  {
    src: 'p7', images: 2, category: 'quan', slug: 'quan-ni-ong-rong-mau-be', name: 'Quần nỉ ống rộng màu be xám',
    price: 450000, sizes: 'XS,S,M,L', color: 'Be xám', material: 'Nỉ cotton',
    gender: 'nu', isNew: true, stock: 40, sold: 58,
    description: 'Quần nỉ nữ ống suông rộng màu be xám, cạp cao chun có dây rút trắng, túi hai bên. Dáng dài chấm gót tôn chân, phối sneaker trắng cực kỳ thoải mái.',
    highlights: ['Ống rộng suông dài', 'Cạp cao dây rút', 'Màu be xám trung tính', 'Nỉ cotton mềm'],
  },
  {
    src: 'p8', images: 3, category: 'quan', slug: 'quan-jogger-do-day-rut-trang', name: 'Quần jogger đỏ dây rút trắng',
    price: 420000, sizes: CLOTHING, color: 'Đỏ', material: 'Nỉ da cá',
    gender: 'unisex', stock: 35, sold: 47,
    description: 'Quần jogger màu đỏ nổi bật, cạp chun dây rút trắng, gấu bo cổ chân. Phối cùng áo nỉ đỏ thành set đồng bộ năng động như ảnh.',
    highlights: ['Màu đỏ nổi bật', 'Dây rút trắng', 'Gấu bo gọn', 'Dễ phối thành set'],
  },
  {
    src: 'p13', images: 2, category: 'quan', slug: 'quan-short-kaki-xanh-reu', name: 'Quần short kaki xanh rêu',
    price: 380000, sizes: '28,29,30,31,32,34', color: 'Xanh rêu', material: 'Kaki cotton',
    gender: 'nam', stock: 45, sold: 69,
    description: 'Quần short kaki nam màu xanh rêu, độ dài trên gối, cạp có đỉa luồn thắt lưng, túi xéo hai bên. Lịch sự vừa đủ cho đi biển hay cà phê cuối tuần.',
    highlights: ['Dài trên gối', 'Cạp có đỉa thắt lưng', 'Túi xéo hai bên', 'Kaki cotton thoáng'],
  },
  {
    src: 'p14', images: 3, category: 'quan', slug: 'quan-short-the-thao-nu-xam', name: 'Quần short thể thao nữ xám than',
    price: 320000, sizes: 'XS,S,M,L', color: 'Xám than', material: 'Polyester co giãn',
    gender: 'nu', stock: 50, sold: 81,
    description: 'Quần short thể thao nữ cạp cao màu xám than, gấu xẻ bo tròn hai bên, túi hông tiện lợi. Vải co giãn nhanh khô cho buổi tập gym, chạy bộ.',
    highlights: ['Cạp cao ôm eo', 'Gấu bo tròn xẻ hai bên', 'Túi hông', 'Co giãn, nhanh khô'],
  },

  // ---------------- Mũ nón ----------------
  {
    src: 'p9', images: 3, category: 'mu-non', slug: 'mu-luoi-trai-xanh-navy', name: 'Mũ lưỡi trai xanh navy',
    price: 220000, sizes: null, color: 'Xanh navy', material: 'Cotton twill',
    gender: 'unisex', stock: 70, sold: 120,
    description: 'Mũ lưỡi trai 6 mảnh màu xanh navy, lỗ thoáng khí thêu trên đỉnh, lưỡi cong vừa phải. Chất cotton twill đứng form, khoá điều chỉnh phía sau.',
    highlights: ['6 mảnh đứng form', 'Lỗ thoáng khí thêu', 'Lưỡi cong vừa', 'Điều chỉnh vòng đầu'],
  },
  {
    src: 'p10', images: 3, category: 'mu-non', slug: 'mu-luoi-trai-xanh-da-troi', name: 'Mũ lưỡi trai xanh da trời',
    price: 220000, sizes: null, color: 'Xanh da trời', material: 'Cotton twill',
    gender: 'unisex', stock: 65, sold: 92,
    description: 'Mũ lưỡi trai màu xanh da trời nhạt tươi mát, form 6 mảnh, lưỡi cong. Màu sắc trẻ trung, hợp đi chơi ngày nắng.',
    highlights: ['Xanh da trời tươi mát', 'Form 6 mảnh', 'Lỗ thoáng khí', 'Điều chỉnh vòng đầu'],
  },
  {
    src: 'p11', images: 3, category: 'mu-non', slug: 'mu-luoi-trai-do', name: 'Mũ lưỡi trai đỏ',
    price: 220000, sizes: null, color: 'Đỏ', material: 'Cotton twill',
    gender: 'unisex', stock: 60, sold: 77,
    description: 'Mũ lưỡi trai màu đỏ tươi, form 6 mảnh đứng dáng, lưỡi cong. Điểm nhấn màu sắc nổi bật cho outfit trơn đơn giản.',
    highlights: ['Màu đỏ nổi bật', 'Form đứng dáng', 'Lưỡi cong', 'Điều chỉnh vòng đầu'],
  },
  {
    src: 'p12', images: 3, category: 'mu-non', slug: 'mu-luoi-trai-den', name: 'Mũ lưỡi trai đen',
    price: 220000, sizes: null, color: 'Đen', material: 'Cotton twill',
    gender: 'unisex', featured: true, stock: 80, sold: 180,
    description: 'Mũ lưỡi trai đen trơn, form 6 mảnh, quai điều chỉnh phía sau. Kiểu dáng kinh điển đội được với mọi phong cách.',
    highlights: ['Đen trơn kinh điển', 'Quai điều chỉnh sau', 'Form 6 mảnh', 'Unisex'],
  },

  // ---------------- Giày ----------------
  {
    src: 'p35', images: 3, category: 'sneaker', slug: 'giay-da-bong-hologram-bac', name: 'Giày đá bóng ánh hologram bạc',
    price: 1690000, sizes: MEN_SHOES, color: 'Bạc hologram', material: 'Da tổng hợp phủ ánh kim, đế đinh',
    gender: 'nam', isNew: true, stock: 18, sold: 22,
    description: 'Giày đá bóng thân bạc kim tuyến ánh hologram, viền đế phản quang cầu vồng, dây buộc bạc và đế đinh bám sân cỏ. Nổi bật trên mọi sân bóng.',
    highlights: ['Ánh hologram cầu vồng', 'Đế đinh bám sân cỏ', 'Thân kim tuyến bạc', 'Dây buộc ôm chân'],
  },
  {
    src: 'p38', images: 3, category: 'sneaker', slug: 'sneaker-chunky-cam-xanh', name: 'Sneaker chunky cam – xanh dương',
    price: 1490000, sizes: UNISEX_SHOES, color: 'Cam / Xanh dương / Bạc', material: 'Da tổng hợp, đế EVA',
    gender: 'unisex', stock: 25, sold: 63,
    description: 'Sneaker đế chunky trắng dày, thân phối các mảng cam, xanh dương và bạc ánh kim, dây buộc xám bạc bản to. Phong cách dad shoes năng động.',
    highlights: ['Đế chunky trắng dày', 'Phối cam – xanh – bạc', 'Dây bản to', 'Đệm êm khi đi lâu'],
  },
  {
    src: 'p39', images: 3, category: 'sneaker', slug: 'giay-vai-hong-neon-soc-trang', name: 'Giày vải hồng neon sọc trắng',
    price: 690000, sizes: UNISEX_SHOES, color: 'Hồng neon', material: 'Vải canvas, đế cao su',
    gender: 'unisex', stock: 40, sold: 95,
    description: 'Giày vải canvas cổ thấp màu hồng neon rực rỡ, sọc lượn trắng bên hông, dây buộc trắng và đế cao su trắng. Trẻ trung, nổi bật cho mùa hè.',
    highlights: ['Hồng neon rực rỡ', 'Sọc lượn trắng bên hông', 'Canvas thoáng khí', 'Đế cao su bền'],
  },
  {
    src: 'p40', images: 3, category: 'sneaker', slug: 'giay-cao-co-futuristic-bac-vang', name: 'Giày cao cổ futuristic bạc viền vàng',
    price: 2190000, sizes: UNISEX_SHOES, color: 'Bạc / Vàng', material: 'Da tổng hợp ánh kim',
    gender: 'unisex', stock: 10, sold: 9,
    description: 'Giày cao cổ thiết kế avant-garde: thân bạc ánh kim, các mảng ốp vàng uốn lượn như áo giáp, đế nhiều lớp góc cạnh. Dành cho sàn diễn, chụp ảnh và những ai thích nổi bật.',
    highlights: ['Thiết kế avant-garde', 'Ốp vàng uốn lượn', 'Thân bạc ánh kim', 'Cổ cao qua mắt cá'],
  },
  {
    src: 'p43', images: 3, category: 'sneaker', slug: 'giay-luoi-penny-loafer-tim', name: 'Giày lười penny loafer da bóng tím',
    price: 1290000, sizes: MEN_SHOES, color: 'Tím mận', material: 'Da bóng, lót da',
    gender: 'nam', stock: 20, sold: 28,
    description: 'Giày lười penny loafer da bóng màu tím mận, quai ngang trên mu, lót trong màu cam, đế đen. Lịch lãm khác biệt cho những dịp trang trọng.',
    highlights: ['Kiểu penny loafer', 'Da bóng tím mận', 'Lót cam tương phản', 'Xỏ chân tiện lợi'],
  },
  {
    src: 'p44', images: 3, category: 'sneaker', slug: 'giay-da-lon-xanh-buoc-day', name: 'Giày da lộn xanh dương buộc dây',
    price: 990000, sizes: MEN_SHOES, color: 'Xanh dương', material: 'Da lộn, đế cao su',
    gender: 'nam', stock: 28, sold: 40,
    description: 'Giày da lộn màu xanh dương nhạt dáng mọi, dây buộc nâu, đế cao su màu nâu có rãnh chống trượt. Thanh lịch thoải mái cho ngày cuối tuần.',
    highlights: ['Da lộn mềm mịn', 'Đế cao su nâu chống trượt', 'Dây buộc nâu', 'Phong cách casual'],
  },
  {
    src: 'p36', images: 3, category: 'giay-cao-got', slug: 'giay-cao-got-kim-tuyen-cau-vong', name: 'Giày cao gót kim tuyến cầu vồng',
    price: 1190000, sizes: WOMEN_SHOES, color: 'Bạc / Cầu vồng', material: 'Kim tuyến, gót ánh kim',
    gender: 'nu', isNew: true, stock: 15, sold: 26,
    description: 'Giày cao gót mũi nhọn phủ kim tuyến bạc lấp lánh, gót nhọn và phần gót sau ánh kim nhiều màu cầu vồng. Toả sáng dưới ánh đèn tiệc.',
    highlights: ['Kim tuyến bạc lấp lánh', 'Gót ánh cầu vồng', 'Mũi nhọn', 'Hợp dự tiệc'],
  },
  {
    src: 'p37', images: 3, category: 'giay-cao-got', slug: 'sandal-de-coi-quai-denim', name: 'Sandal đế cói quai denim',
    price: 590000, sizes: WOMEN_SHOES, color: 'Xanh denim', material: 'Quai denim, đế cói',
    gender: 'nu', stock: 35, sold: 72,
    description: 'Sandal nữ đế bằng viền cói bện, quai denim xanh nhạt đan chéo phía trước, quai hậu dán dính tiện lợi. Nhẹ nhàng cho những chuyến đi biển.',
    highlights: ['Đế viền cói bện', 'Quai denim đan chéo', 'Quai hậu dán', 'Đế bằng êm chân'],
  },
  {
    src: 'p41', images: 3, category: 'giay-cao-got', slug: 'bot-cao-got-futuristic-xam', name: 'Bốt cao gót futuristic xám',
    price: 2290000, sizes: WOMEN_SHOES, color: 'Xám / Vàng', material: 'Da tổng hợp',
    gender: 'nu', stock: 8, sold: 6,
    description: 'Bốt cổ cao màu xám thiết kế tương lai: gót cong hình vòng cung, đế viền vàng, mũi hở điểm hồng. Món đồ avant-garde cho sàn diễn và bộ ảnh thời trang.',
    highlights: ['Gót vòng cung độc đáo', 'Đế viền vàng', 'Cổ cao ống rộng', 'Thiết kế avant-garde'],
  },
  {
    src: 'p42', images: 3, category: 'giay-cao-got', slug: 'giay-got-vuong-da-bong-xam', name: 'Giày gót vuông da bóng xám khoá vàng',
    price: 1090000, sizes: WOMEN_SHOES, color: 'Xám', material: 'Da bóng, gót mạ vàng',
    gender: 'nu', stock: 22, sold: 35,
    description: 'Giày nữ da bóng màu xám, mũi vuông, khoét hở hai bên, gót vuông thấp mạ vàng và khoá kim loại vàng trang trí trên mũi. Thanh lịch, dễ đi cả ngày.',
    highlights: ['Gót vuông thấp mạ vàng', 'Khoá kim loại vàng', 'Da bóng xám', 'Khoét hở hai bên'],
  },

  // ---------------- Túi xách ----------------
  {
    src: 'f1', images: 1, category: 'tui-xach', slug: 'balo-vai-nap-gap-xanh-navy', name: 'Balo vải nắp gập xanh navy',
    price: 1190000, sizes: null, color: 'Xanh navy', material: 'Vải canvas chống nước',
    gender: 'unisex', stock: 30, sold: 84,
    description: 'Balo vải canvas xanh navy dáng chữ nhật, nắp gập có quai cài, logo da nâu phía trước, túi ngoài có nắp. Ngăn chính chứa vừa laptop 15 inch.',
    highlights: ['Vừa laptop 15 inch', 'Canvas chống nước', 'Nắp gập có quai cài', 'Túi ngoài có nắp'],
  },

  // ---------------- Trang sức ----------------
  {
    src: 'f5', images: 1, category: 'trang-suc', slug: 'vong-tay-bac-dau-rong', name: 'Vòng tay bạc đầu rồng',
    price: 1590000, sizes: null, color: 'Bạc', material: 'Bạc 925',
    gender: 'unisex', featured: true, stock: 15, sold: 21,
    description: 'Vòng tay dây xích đan bạc tinh xảo, đầu khoá chạm khắc hình đầu rồng. Mạnh mẽ, cá tính và hợp đeo cả nam lẫn nữ.',
    highlights: ['Đầu rồng chạm khắc', 'Dây xích đan tinh xảo', 'Bạc 925', 'Unisex'],
  },
  {
    src: 'f6', images: 1, category: 'trang-suc', slug: 'nhan-dinh-da-micro-pave', name: 'Nhẫn bạc đính đá micro pavé',
    price: 890000, sizes: RING, color: 'Bạc', material: 'Bạc 925 mạ vàng trắng, đá CZ',
    gender: 'nu', stock: 25, sold: 48,
    description: 'Nhẫn bản mảnh mạ vàng trắng, đính một hàng đá nhỏ kiểu micro pavé lấp lánh quanh nửa vòng. Tinh tế để đeo hằng ngày hoặc làm nhẫn cưới.',
    highlights: ['Hàng đá micro pavé', 'Bản mảnh thanh lịch', 'Mạ vàng trắng', 'Đeo hằng ngày'],
  },
  {
    src: 'f7', images: 1, category: 'trang-suc', slug: 'bo-nhan-cuoi-da-vuong-halo', name: 'Bộ nhẫn cưới đá vuông halo',
    price: 1290000, original_price: 1490000, sizes: RING, color: 'Bạc', material: 'Bạc 925 mạ vàng trắng, đá CZ',
    gender: 'nu', isNew: true, stock: 18, sold: 33,
    description: 'Bộ hai nhẫn: nhẫn chính đính viên đá vuông lớn bao quanh viền đá nhỏ (halo) và nhẫn trơn đính đá đi kèm. Lấp lánh cho ngày cầu hôn và lễ cưới.',
    highlights: ['Đá vuông halo lớn', 'Bộ 2 nhẫn đeo chồng', 'Mạ vàng trắng', 'Hộp quà sang trọng'],
  },

  // ---------------- Đồng hồ ----------------
  {
    src: 'd106', images: 3, category: 'dong-ho', slug: 'dong-ho-thong-minh-vo-vang-hong', name: 'Đồng hồ thông minh vỏ vàng hồng',
    price: 5990000, sizes: null, color: 'Vàng hồng / Hồng cát', material: 'Vỏ nhôm, dây vải dệt',
    gender: 'unisex', isNew: true, stock: 15, sold: 37,
    description: 'Đồng hồ thông minh mặt vuông bo góc, vỏ nhôm vàng hồng, dây vải dệt loop màu hồng cát dán dính. Theo dõi vận động, nhịp tim và nhận thông báo ngay trên cổ tay.',
    highlights: ['Màn hình vuông bo góc', 'Dây vải dệt loop', 'Theo dõi nhịp tim, vận động', 'Vỏ nhôm vàng hồng'],
  },

  // ---------------- Nước hoa ----------------
  {
    src: 'd6', images: 3, category: 'nuoc-hoa', slug: 'nuoc-hoa-unisex-cam-chanh', name: 'Nước hoa unisex hương cam chanh',
    price: 1290000, sizes: null, color: 'Trong suốt', material: 'Eau de Toilette 100ml',
    gender: 'unisex', stock: 30, sold: 96,
    description: 'Chai thuỷ tinh mờ dáng dẹt với nắp nhôm bạc, hộp giấy trắng tối giản. Hương cam chanh tươi mát pha trà xanh – sạch sẽ, dễ dùng cho cả nam lẫn nữ.',
    highlights: ['Hương cam chanh, trà xanh', 'Unisex', 'Chai thuỷ tinh mờ', 'Lưu hương 4–6 giờ'],
  },
  {
    src: 'd7', images: 3, category: 'nuoc-hoa', slug: 'nuoc-hoa-nu-chai-vuong-den', name: 'Nước hoa nữ chai vuông đen',
    price: 3490000, sizes: null, color: 'Đen / Vàng', material: 'Eau de Parfum 50ml',
    gender: 'nu', featured: true, stock: 15, sold: 41,
    description: 'Chai thuỷ tinh vuông màu đen bóng, nhãn đen viền vàng, hộp đen sang trọng. Hương gỗ phương Đông ấm áp với hoa hồng và hoắc hương – quyến rũ cho buổi tối.',
    highlights: ['Hương gỗ phương Đông', 'Chai vuông đen sang trọng', 'Eau de Parfum lưu hương lâu', 'Hợp dùng buổi tối'],
  },
  {
    src: 'd8', images: 3, category: 'nuoc-hoa', slug: 'nuoc-hoa-nu-chai-giot-nuoc-vang', name: 'Nước hoa nữ chai giọt nước vàng',
    price: 3290000, sizes: null, color: 'Vàng hổ phách', material: 'Eau de Parfum 50ml',
    gender: 'nu', stock: 18, sold: 52,
    description: 'Chai dáng giọt nước màu vàng hổ phách, cổ chai quấn vòng kim loại vàng, nắp tròn trong suốt. Hương hoa cỏ ngọt ngào, nữ tính và thanh lịch.',
    highlights: ['Hương hoa cỏ nữ tính', 'Chai giọt nước cổ vàng', 'Eau de Parfum', 'Dùng hằng ngày'],
  },
  {
    src: 'd9', images: 3, category: 'nuoc-hoa', slug: 'nuoc-hoa-nu-nap-hoa-vang', name: 'Nước hoa nữ nắp hoa vàng',
    price: 2490000, sizes: null, color: 'Vàng nhạt', material: 'Eau de Toilette 50ml',
    gender: 'nu', isNew: true, stock: 20, sold: 29,
    description: 'Chai thuỷ tinh trong nắp hình bông hoa vàng, cổ thắt nơ đen, hộp vàng nhạt. Hương trái cây tươi sáng như xoài, dứa xen hoa trắng – vui tươi cho mùa hè.',
    highlights: ['Hương trái cây tươi sáng', 'Nắp hình hoa vàng', 'Nơ đen ở cổ chai', 'Hợp mùa hè'],
  },
  {
    src: 'd10', images: 3, category: 'nuoc-hoa', slug: 'nuoc-hoa-nu-chai-hong-phan', name: 'Nước hoa nữ chai hồng phấn',
    price: 2990000, sizes: null, color: 'Hồng phấn', material: 'Eau de Parfum 50ml',
    gender: 'nu', stock: 16, sold: 38,
    description: 'Chai vuông màu hồng phấn, nhãn trắng viền khung đen, hộp in hoạ tiết hoa đỏ cổ điển. Hương hoa trắng huệ và nhài thanh khiết, lãng mạn.',
    highlights: ['Hương hoa huệ, nhài', 'Chai hồng phấn vuông', 'Hộp hoạ tiết hoa cổ điển', 'Eau de Parfum'],
  },

  // ---------------- Trang điểm ----------------
  {
    src: 'd1', images: 1, category: 'trang-diem', slug: 'mascara-lam-day-mi', name: 'Mascara làm dày và cong mi',
    price: 189000, sizes: null, color: 'Đen', material: 'Tuýp 12ml',
    gender: 'nu', stock: 90, sold: 260,
    description: 'Mascara tuýp đen hoạ tiết xanh lá, đầu cọ silicon chải đều từng sợi mi, giúp mi dày và cong vút suốt cả ngày, không lem.',
    highlights: ['Làm dày & cong mi', 'Đầu cọ silicon', 'Không lem, không vón', 'Tẩy dễ bằng nước ấm'],
  },
  {
    src: 'd2', images: 1, category: 'trang-diem', slug: 'bang-phan-mat-co-guong', name: 'Bảng phấn mắt nhiều màu có gương',
    price: 459000, sizes: null, color: 'Tông nude – đỏ – nâu', material: 'Phấn nén',
    gender: 'nu', featured: true, stock: 45, sold: 118,
    description: 'Bảng phấn mắt vỏ đen có gương lớn ở nắp, gồm các ô màu nude, hồng, đỏ gạch và nâu, xen lẫn chất lì và nhũ. Đủ để trang điểm từ nhẹ nhàng đến dự tiệc.',
    highlights: ['Nhiều tông nude – đỏ – nâu', 'Có gương lớn ở nắp', 'Chất lì và nhũ', 'Lên màu chuẩn'],
  },
  {
    src: 'd3', images: 1, category: 'trang-diem', slug: 'phan-phu-nen-hop-tron', name: 'Phấn phủ nén hộp tròn',
    price: 299000, sizes: null, color: 'Be tự nhiên', material: 'Phấn nén 10g',
    gender: 'nu', stock: 60, sold: 97,
    description: 'Phấn phủ nén trong hộp tròn đen nắp bật, màu be tự nhiên giúp cố định lớp nền, kiềm dầu và cho làn da mịn lì cả ngày.',
    highlights: ['Kiềm dầu, mịn lì', 'Màu be tự nhiên', 'Hộp tròn gọn nhẹ', 'Cố định lớp nền'],
  },
  {
    src: 'd4', images: 1, category: 'trang-diem', slug: 'son-thoi-do-co-dien', name: 'Son thỏi đỏ cổ điển',
    price: 259000, sizes: null, color: 'Đỏ cổ điển', material: 'Thỏi 3.5g',
    gender: 'nu', stock: 75, sold: 205,
    description: 'Son thỏi màu đỏ cổ điển, vỏ đen viền vàng. Chất son mềm mượt, lên màu chuẩn ngay lần quẹt đầu, giữ màu lâu và không làm khô môi.',
    highlights: ['Đỏ cổ điển', 'Lên màu chuẩn', 'Mềm mượt, không khô môi', 'Vỏ đen viền vàng'],
  },
  {
    src: 'd5', images: 1, category: 'trang-diem', slug: 'son-mong-tay-do', name: 'Sơn móng tay đỏ',
    price: 129000, sizes: null, color: 'Đỏ', material: 'Chai 15ml',
    gender: 'nu', stock: 80, sold: 150,
    description: 'Sơn móng tay màu đỏ tươi bóng, nắp đen dài dễ cầm. Một lớp đã lên màu, khô nhanh và bền màu đến 7 ngày.',
    highlights: ['Đỏ tươi bóng', 'Khô nhanh', 'Bền màu đến 7 ngày', 'Cọ dẹt dễ sơn'],
  },

  // ---------------- Phụ kiện công nghệ ----------------
  {
    src: 'd100', images: 3, category: 'cong-nghe', slug: 'tai-nghe-khong-day-hop-sac-trang', name: 'Tai nghe không dây hộp sạc trắng',
    price: 3990000, sizes: null, color: 'Trắng', material: 'Nhựa nhám cao cấp',
    gender: 'unisex', featured: true, stock: 25, sold: 140,
    description: 'Tai nghe true wireless màu trắng dáng thân ngắn, kèm hộp sạc nhỏ gọn có đèn báo. Kết nối nhanh, âm thanh trong trẻo, nghe nhạc đến 6 giờ mỗi lần sạc.',
    highlights: ['True wireless', 'Hộp sạc nhỏ gọn', 'Nghe 6 giờ/lần sạc', 'Cảm biến chạm'],
  },
  {
    src: 'd101', images: 1, category: 'cong-nghe', slug: 'tai-nghe-chup-tai-bac', name: 'Tai nghe chụp tai màu bạc',
    price: 12990000, sizes: null, color: 'Bạc', material: 'Nhôm, đệm lưới',
    gender: 'unisex', stock: 8, sold: 17,
    description: 'Tai nghe chụp tai vỏ nhôm bạc, chụp tai bọc đệm lưới xám êm ái, quai đeo lưới thoáng khí. Chống ồn chủ động, âm thanh chi tiết cho người mê nhạc.',
    highlights: ['Chống ồn chủ động', 'Vỏ nhôm bạc', 'Đệm lưới êm tai', 'Pin đến 20 giờ'],
  },
  {
    src: 'd107', images: 1, category: 'cong-nghe', slug: 'tai-nghe-day-quang-co-vang-chanh', name: 'Tai nghe dây quàng cổ vàng chanh',
    price: 1290000, sizes: null, color: 'Vàng chanh', material: 'Silicon',
    gender: 'unisex', isNew: true, stock: 35, sold: 46,
    description: 'Tai nghe không dây kiểu dây mềm quàng cổ màu vàng chanh, hai đầu tai nam châm tự hút vào nhau khi không dùng. Nhẹ, hợp chạy bộ và tập luyện.',
    highlights: ['Dây quàng cổ mềm', 'Đầu tai nam châm', 'Siêu nhẹ', 'Hợp chạy bộ'],
  },
  {
    src: 'd108', images: 4, category: 'cong-nghe', slug: 'op-lung-silicon-mau-man', name: 'Ốp lưng silicon màu mận',
    price: 790000, sizes: null, color: 'Mận', material: 'Silicon, lót vi sợi',
    gender: 'unisex', stock: 50, sold: 88,
    description: 'Ốp lưng điện thoại silicon màu mận, mặt trong lót vi sợi mềm, có nam châm hỗ trợ sạc không dây từ tính. Ôm sát máy, bảo vệ các cạnh và camera.',
    highlights: ['Silicon mềm mịn', 'Lót vi sợi bên trong', 'Hỗ trợ sạc từ tính', 'Bảo vệ cạnh và camera'],
  }
);

module.exports = { categories, products };
