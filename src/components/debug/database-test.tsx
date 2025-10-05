import { prisma } from '@/lib/prisma'

export async function DatabaseTest() {
  try {
    const categories = await prisma.category.findMany()
    const products = await prisma.product.findMany()

    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="font-bold">Database Test Results:</h3>
        <p>Categories found: {categories.length}</p>
        <p>Products found: {products.length}</p>
        <details>
          <summary>Categories</summary>
          <pre>{JSON.stringify(categories, null, 2)}</pre>
        </details>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="font-bold">Database Error:</h3>
        <p>{String(error)}</p>
      </div>
    )
  }
}