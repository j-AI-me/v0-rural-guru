// This script would help identify server components with ssr: false
// In a real environment, you'd run this on your codebase

const fs = require("fs")
const path = require("path")

// Simulating a search through files
console.log("Searching for potential 'ssr: false' in server components...")

// Let's check some key files that might have this issue
const potentialServerComponentsWithSsrFalse = [
  "app/layout.tsx",
  "app/page.tsx",
  "app/propiedades/[id]/page.tsx",
  "app/propiedades/[id]/page.optimized.tsx",
  "app/dashboard/layout.tsx",
  "app/dashboard/page.tsx",
]

console.log("Files to check for potential issues:")
potentialServerComponentsWithSsrFalse.forEach((file) => {
  console.log(`- ${file}`)
})

console.log("\nPotential issues to look for:")
console.log("1. Server components with 'ssr: false' in dynamic imports")
console.log("2. Missing 'use client' directive in files using client-side features")
console.log("3. Client components imported directly in server components without proper separation")

console.log("\nRecommended approach:")
console.log("1. Create separate client component files for any component using 'ssr: false'")
console.log("2. Add 'use client' directive to all component files using client-side features")
console.log("3. Import client components in server components without passing client-side props")
