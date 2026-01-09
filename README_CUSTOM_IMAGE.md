# 如何只替换一个特定产品卡片的图片

根据您的需求，本指南将帮助您只替换一个特定产品卡片的图片，而不是所有产品卡片。

## 方法说明

我们已经修改了 `ProductCard.tsx` 组件，使其正确使用每个产品自身的 `imageUrl` 属性。现在，您只需要在产品数据文件中找到并修改特定产品的图片URL即可。

## 修改步骤

1. 使用任意代码编辑器打开项目中的 `src/lib/productData.ts` 文件

2. 在该文件中，找到您想要修改的产品类别数组。例如：
   - 食品铁盒: `foodIronBoxProducts`
   - 酒罐: `wineCansProducts`
   - 化妆品罐: `cosmeticTinProducts`
   - 等等...

3. 在对应的产品数组中，找到您想要修改的特定产品对象。您可以通过产品的 `id` 或 `name` 来识别它。

4. 将该产品对象中的 `imageUrl` 属性值替换为您想要使用的新图片URL。

5. 保存文件并重新构建项目：
   ```bash
   pnpm install
   pnpm run build
   ```

## 示例

以下是修改特定产品图片的示例代码：

```typescript
// 在 foodIronBoxProducts 数组中找到 ID 为 1 的产品并修改其图片
const targetProductIndex = foodIronBoxProducts.findIndex(product => product.id === 1);
if (targetProductIndex !== -1) {
  foodIronBoxProducts[targetProductIndex].imageUrl = "您的新图片URL";
}

// 或者直接在数组中查找并修改
foodIronBoxProducts.forEach(product => {
  if (product.id === 1) { // 替换为您想要修改的产品ID
    product.imageUrl = "您的新图片URL";
  }
});
```

## 注意事项

1. 请确保您使用的图片URL是有效的，并且可以在浏览器中正常访问。

2. 如果您想同时修改产品的额外图片，可以修改同一产品对象中的 `additionalImages` 数组。

3. 修改完成后，记得重新构建项目以使更改生效。

4. 如果您需要帮助识别哪个产品ID对应哪个产品，请查看网站上的产品详情页面，URL中通常会包含产品ID。