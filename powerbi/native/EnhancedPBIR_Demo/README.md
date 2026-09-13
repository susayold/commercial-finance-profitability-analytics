# Enhanced PBIR Demo

Đây là một Power BI Project (`.pbip`) mẫu dùng Power BI Enhanced Report Format (PBIR) và TMDL.

## Cách mở

1. Giải nén thư mục nếu đang mở từ file ZIP.
2. Mở `Enhanced PBIR Demo.pbip` bằng Power BI Desktop bản tương đối mới.
3. Nếu Power BI hỏi bật tính năng thử nghiệm, vào **File > Options and settings > Options > Preview features** và bật **Power BI Project (.pbip)**, **Store reports using enhanced metadata format (PBIR)** và **Store semantic models using TMDL format**.

## Kiểm tra Enhanced PBIR

- Report dùng `Enhanced PBIR Demo.Report/definition.pbir` với `version: 4.0`.
- Metadata report nằm trong thư mục `Enhanced PBIR Demo.Report/definition/`.
- Mỗi page nằm trong `definition/pages/`; mỗi visual nằm trong thư mục riêng với file `visual.json`.
- Semantic model nằm trong `Enhanced PBIR Demo.SemanticModel/definition/` dưới dạng TMDL.

Dữ liệu mẫu được nhúng trong các Power Query M expression của semantic model, nên không cần file Excel nguồn bên ngoài.

## Lưu ý

Enhanced PBIR hiện vẫn phụ thuộc vào phiên bản Power BI Desktop và đang được Microsoft phát hành theo dạng preview/rollout. Đây là project format (`.pbip`), không phải một file `.pbix` đơn lẻ.

Mẫu được dựng từ cấu trúc demo PBIR/TMDL công khai của FabricTools/pbir-samples; giấy phép MIT được giữ trong `LICENSE.txt`.
