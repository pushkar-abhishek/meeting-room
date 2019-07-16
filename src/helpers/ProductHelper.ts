/**
 * ProductHelper
 */

export class ProductHelper {
    public  findUnique(categoryProducts : any[]) : Set<string> {
        const brands: any = categoryProducts.map((b: any) => b.brand);
        const bSet: any = new Set<string>();
        brands.forEach((d: any) => {
            bSet.add(d);
        });

        return bSet;
    }
}
