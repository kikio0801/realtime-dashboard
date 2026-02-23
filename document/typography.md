# 🎨 타이포그래피 (Typography)

본 프로젝트는 **'A2z' (에이투지체)** 폰트를 기본 서체로 사용합니다.

- **Licensing**: 상업적 이용이 가능한 무료 폰트입니다. (출처: [눈누 A2z](https://noonnu.cc/font_page/1778))
- **Design Philosophy**: 한글은 현대적이고 도회적인 인상의 **A2z**를, 영문과 숫자는 기하학적 산세리프 서체인 **Outfit**을 사용하여 완벽한 조화를 이룹니다.
  > **Note**: A2z 폰트는 Outfit 폰트를 기반으로 설계되었으며, 두 서체를 혼용해도 이질감 없이 하나의 서체처럼 자연스러운 시각적 흐름을 제공합니다.
- **Switching**: `frontend/src/app/globals.css` 파일에서 주석을 해제하여 **Pretendard**로 손쉽게 전환할 수 있습니다.

```css
/* frontend/src/app/globals.css - :root 블록에서 --root-font-sans 변수를 수정하여 폰트를 전환하세요 */
:root {
  --root-font-sans: 'A2z', 'Pretendard', sans-serif; /* 기본 서체 (Default) */
  /* --root-font-sans: 'Pretendard', sans-serif; */ /* 주석 해제 시 프리텐다드로 전환 */
}
```

> [!TIP]
> **폰트 전환 방법**: `frontend/src/app/globals.css` 파일의 `:root` 블록 내에 정의된 `--root-font-sans` 변수에서 원하는 설정의 주석을 해제하거나 수정하여 프로젝트 전체의 폰트를 손쉽게 변경할 수 있습니다. @theme 블록은 이 변수를 참조하여 시스템 서체를 결정합니다.
