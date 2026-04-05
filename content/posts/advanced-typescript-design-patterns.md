---
title: "Advanced TypeScript Design Patterns for React Apps"
date: 2024-08-28
tags: [TypeScript, Architecture, React]
description: "Discriminated unions, branded types, and the builder pattern — applied to real React component APIs."
published: true
cover: ""
---

TypeScript's type system is powerful enough to encode domain invariants that would otherwise live only in developer documentation. These patterns move constraints from comments into the compiler.

## Discriminated Unions for Component State

A common mistake is using optional boolean props to represent mutually exclusive states:

```tsx
// ❌ These three can be simultaneously true
interface ButtonProps {
  loading?: boolean
  disabled?: boolean
  error?: boolean
}
```

Discriminated unions make illegal states unrepresentable:

```tsx
type ButtonState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'disabled'; reason: string }

interface ButtonProps {
  state: ButtonState
  children: React.ReactNode
}
```

The `message` and `reason` fields are only accessible when their respective status is active. The compiler enforces this at every call site.

## Branded Types for IDs

Runtime values that are structurally identical but semantically distinct — like `UserId` and `PostId` — are both `string` in plain TypeScript. Branded types prevent mixups:

```ts
declare const __brand: unique symbol
type Brand<B> = { [__brand]: B }
type Branded<T, B> = T & Brand<B>

type UserId = Branded<string, 'UserId'>
type PostId = Branded<string, 'PostId'>

// Type error: Argument of type 'UserId' is not assignable to type 'PostId'
function getPost(id: PostId): Promise<Post> { ... }
const userId = '123' as UserId
getPost(userId) // ❌ caught at compile time
```

## The Builder Pattern for Complex Configs

When a function accepts many optional parameters, a builder reads better than a large options object:

```ts
class QueryBuilder<T> {
  private filters: Filter[] = []
  private _limit = 20
  private _orderBy?: keyof T

  where(filter: Filter) {
    this.filters.push(filter)
    return this
  }

  limit(n: number) {
    this._limit = n
    return this
  }

  orderBy(field: keyof T) {
    this._orderBy = field
    return this
  }

  build(): Query<T> {
    return { filters: this.filters, limit: this._limit, orderBy: this._orderBy }
  }
}

// Usage
const query = new QueryBuilder<Post>()
  .where({ field: 'published', value: true })
  .orderBy('date')
  .limit(10)
  .build()
```

The method chaining is type-safe — `orderBy` only accepts keys of `T`, caught at compile time.

## Inferring Props from Data

Instead of maintaining a separate type and a data array in sync, derive the type from the data:

```ts
const NAV_ITEMS = ['resume', 'blog', 'projects'] as const
type NavItem = typeof NAV_ITEMS[number]  // 'resume' | 'blog' | 'projects'
```

Add a new entry to the array, and the type updates automatically across the codebase.
