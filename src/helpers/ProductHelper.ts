export class ProductHelper {
    public static findUnique(category_products : Array<any>) : Set<string>{
        let brands = category_products.map((b: any) => b.brand);
        let bSet = new Set<string>();
        brands.forEach((d) => {
            bSet.add(d)
        })
        return bSet;
    }
}