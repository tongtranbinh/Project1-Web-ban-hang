import random

from django.core.management.base import BaseCommand
from django.db import transaction
from products.models import Category, Product, ProductImage


SAMPLE_CATEGORIES = [
    {"name": "Điện thoại", "description": "Smartphone và phụ kiện"},
    {"name": "Laptop", "description": "Máy tính xách tay cho mọi nhu cầu"},
    {"name": "Tai nghe", "description": "Âm thanh chất lượng cao"},
    {"name": "Tablet", "description": "Máy tính bảng giải trí và công việc"},
    {"name": "Smartwatch", "description": "Đồng hồ thông minh"},
    {"name": "Màn hình", "description": "Màn hình làm việc và gaming"},
    {"name": "Loa", "description": "Loa di động và loa phòng"},
    {"name": "Phụ kiện", "description": "Phụ kiện đi kèm thiết bị"},
]

SAMPLE_PRODUCTS = [
    {
        "name": "iPhone 15 Pro",
        "description": "Chip A17 Pro, camera 48MP, Titanium",
        "price": 28990000,
        "stock": 20,
        "category": "Điện thoại",
        "images": [
            "https://picsum.photos/seed/iphone15/800/600",
            "https://picsum.photos/seed/iphone15-2/800/600",
            "https://picsum.photos/seed/iphone15-3/800/600",
            "https://picsum.photos/seed/iphone15-4/800/600",
        ],
    },
    {
        "name": "Samsung Galaxy S24",
        "description": "AI features, màn hình Dynamic AMOLED",
        "price": 21990000,
        "stock": 30,
        "category": "Điện thoại",
        "images": [
            "https://picsum.photos/seed/galaxys24/800/600",
            "https://picsum.photos/seed/galaxys24-2/800/600",
            "https://picsum.photos/seed/galaxys24-3/800/600",
        ],
    },
    {
        "name": "Xiaomi 14",
        "description": "Camera Leica, Snapdragon 8 Gen3",
        "price": 15990000,
        "stock": 35,
        "category": "Điện thoại",
        "images": ["https://picsum.photos/seed/xiaomi14/800/600"],
    },
    {
        "name": "Realme 12 Pro",
        "description": "Màn cong 120Hz, sạc nhanh",
        "price": 8990000,
        "stock": 40,
        "category": "Điện thoại",
        "images": ["https://picsum.photos/seed/realme12pro/800/600"],
    },
    {
        "name": "MacBook Air M2 13",
        "description": "Chip Apple M2, mỏng nhẹ, pin lâu",
        "price": 27990000,
        "stock": 15,
        "category": "Laptop",
        "images": [
            "https://picsum.photos/seed/mba13m2/800/600",
            "https://picsum.photos/seed/mba13m2-2/800/600",
            "https://picsum.photos/seed/mba13m2-3/800/600",
            "https://picsum.photos/seed/mba13m2-4/800/600",
            "https://picsum.photos/seed/mba13m2-5/800/600",
        ],
    },
    {
        "name": "Dell XPS 13",
        "description": "Thiết kế viền mỏng, hiệu năng cao",
        "price": 32990000,
        "stock": 10,
        "category": "Laptop",
        "images": [
            "https://picsum.photos/seed/dellxps13/800/600",
            "https://picsum.photos/seed/dellxps13-2/800/600",
            "https://picsum.photos/seed/dellxps13-3/800/600",
        ],
    },
    {
        "name": "Asus ROG Zephyrus G14",
        "description": "Ryzen + RTX, máy gaming mỏng nhẹ",
        "price": 38990000,
        "stock": 12,
        "category": "Laptop",
        "images": [
            "https://picsum.photos/seed/rog14/800/600",
            "https://picsum.photos/seed/rog14-2/800/600",
            "https://picsum.photos/seed/rog14-3/800/600",
        ],
    },
    {
        "name": "Lenovo ThinkPad X1 Carbon Gen11",
        "description": "Siêu nhẹ, bàn phím êm, pin tốt",
        "price": 42990000,
        "stock": 8,
        "category": "Laptop",
        "images": ["https://picsum.photos/seed/x1carbon/800/600"],
    },
    {
        "name": "LG Gram 16",
        "description": "Laptop siêu nhẹ, màn 16 inch",
        "price": 35990000,
        "stock": 14,
        "category": "Laptop",
        "images": ["https://picsum.photos/seed/lggram16/800/600"],
    },
    {
        "name": "Acer Nitro 5",
        "description": "Laptop gaming tầm trung, RTX 4050",
        "price": 24990000,
        "stock": 18,
        "category": "Laptop",
        "images": ["https://picsum.photos/seed/nitro5/800/600"],
    },
    {
        "name": "iPad Air M2",
        "description": "Mỏng nhẹ, hỗ trợ Apple Pencil",
        "price": 16990000,
        "stock": 25,
        "category": "Tablet",
        "images": ["https://picsum.photos/seed/ipadairm2/800/600"],
    },
    {
        "name": "iPad Pro M4 11",
        "description": "Màn 120Hz, chip M4 mạnh mẽ",
        "price": 25990000,
        "stock": 20,
        "category": "Tablet",
        "images": [
            "https://picsum.photos/seed/ipadpro11m4/800/600",
            "https://picsum.photos/seed/ipadpro11m4-2/800/600",
            "https://picsum.photos/seed/ipadpro11m4-3/800/600",
            "https://picsum.photos/seed/ipadpro11m4-4/800/600",
        ],
    },
    {
        "name": "Apple Watch Series 9",
        "description": "Theo dõi sức khỏe, màn luôn hiển thị",
        "price": 11990000,
        "stock": 30,
        "category": "Smartwatch",
        "images": ["https://picsum.photos/seed/watchs9/800/600"],
    },
    {
        "name": "Samsung Galaxy Watch 6",
        "description": "WearOS, đo sức khỏe nâng cao",
        "price": 7990000,
        "stock": 35,
        "category": "Smartwatch",
        "images": ["https://picsum.photos/seed/watch6/800/600"],
    },
    {
        "name": "AirPods Pro 2",
        "description": "Chống ồn chủ động, Spatial Audio",
        "price": 5990000,
        "stock": 50,
        "category": "Phụ kiện",
        "images": ["https://picsum.photos/seed/airpodspro2/800/600"],
    },
    {
        "name": "Sony WH-1000XM5",
        "description": "Chống ồn chủ động, âm thanh tuyệt vời",
        "price": 7990000,
        "stock": 25,
        "category": "Tai nghe",
        "images": [
            "https://picsum.photos/seed/xm5/800/600",
            "https://picsum.photos/seed/xm5-2/800/600",
            "https://picsum.photos/seed/xm5-3/800/600",
        ],
    },
    {
        "name": "JBL Charge 5",
        "description": "Loa di động chống nước, bass khỏe",
        "price": 3990000,
        "stock": 40,
        "category": "Loa",
        "images": [
            "https://picsum.photos/seed/charge5/800/600",
            "https://picsum.photos/seed/charge5-2/800/600",
        ],
    },
    {
        "name": "Sony SRS-XB33",
        "description": "Loa di động Extra Bass, đèn LED",
        "price": 3490000,
        "stock": 35,
        "category": "Loa",
        "images": ["https://picsum.photos/seed/xsb33/800/600"],
    },
    {
        "name": "MSI MAG 27",
        "description": "Màn hình 27 inch, 165Hz, IPS",
        "price": 5990000,
        "stock": 22,
        "category": "Màn hình",
        "images": ["https://picsum.photos/seed/msimag27/800/600"],
    },
    {
        "name": "LG Ultragear 27",
        "description": "Màn hình gaming 27 inch, 144Hz",
        "price": 6990000,
        "stock": 20,
        "category": "Màn hình",
        "images": ["https://picsum.photos/seed/lgug27/800/600"],
    },
]


class Command(BaseCommand):
    help = "Seed sample categories and products into the database"

    @transaction.atomic
    def handle(self, *args, **options):
        # Create categories map
        name_to_category = {}
        for cat in SAMPLE_CATEGORIES:
            category, _ = Category.objects.get_or_create(
                name=cat["name"],
                defaults={"description": cat.get("description", "")},
            )
            name_to_category[category.name] = category
        self.stdout.write(self.style.SUCCESS(f"Categories ready: {len(name_to_category)}"))

        # Create products
        created = 0
        for p in SAMPLE_PRODUCTS:
            category = name_to_category.get(p["category"])  # may be None
            product, was_created = Product.objects.get_or_create(
                name=p["name"],
                defaults={
                    "description": p.get("description", ""),
                    "price": p["price"],
                    "stock": p["stock"],
                    "sold": random.randint(0, max(5, int(p["stock"] * 1.5))),
                    "is_active": True,
                    "category": category,
                },
            )
            if was_created:
                created += 1

            # Attach image records (if using Cloudinary or remote URL support)
            for img_url in p.get("images", []):
                if not product.images.filter(image=img_url).exists():
                    ProductImage.objects.create(product=product, image=img_url)

        total = Product.objects.count()
        self.stdout.write(self.style.SUCCESS(f"Seed complete. New products: {created}. Total products: {total}"))
