# @farbenmeer/eager

Have you ever been annoyed by how complicated it can be to map promises to the actual values you need?

```ts
const myPromise = Promise.resolve({ 
    house: { 
        roof: { 
            shingles: 576 
        }, 
        cellar: { 
            size: 40 
        }, 
        livingRoom: { 
            chair: { 
                height: 5 
            }, 
            sofa: { 
                width: 10 
            }
        }
    }
})

const house = myPromise.then(data => data.house)

const livingRoom = house.then(house => house.livingRoom)

const chairHeight = await livingRoom.then(livingRoom => livingRoom.chairHeight)
```

What if it was possible to automate this as much as possible?

## Welcome to eager

```ts
const data = eager(myPromise)

const house = data.house

const livingRoom = house.livingRoom

const chairHeight = await livingRoom.chairHeight
```

## Why is this useful?

Defining skeletons in react must currently be done at the highest level where a promise is resolved:

```tsx
async function House() {
    const { house } = await fetchHouseData()

    return (
        <>
            <Roof shingles={house.roof.shingles} />
            <LivingRoom>
                <Chair height={house.livingRoom.chair.height} />
                <Sofa width={house.livingRoom.sofa.width} />
            </LivingRoom>
            <Cellar size={house.cellar.size} />
        </>
    )
}

function HouseSkeleton() {
    return (
        <>
            <RoofSkeleton />
            <LivingRoom>
                <ChairSkeleton />
                <SofaSkeleton />
            <CellarSkeleton />
        </>
    )
}
```

This can become tedious because the skeletons must be defined separately from the main rendering logic
so a lot of structure must be duplicated and kept in sync.

Instead, with eager, it is possible to write

```tsx
function House() {
    const { house } = eager(fetchHouseData())

    return (
        <>
            <Suspense fallback={<RoofSkeleton />}>
                <Roof shingles={house.shingles} />
            </Suspense>
            <LivingRoom>
                <Suspense fallback={<ChairSkeleton />}>
                    <Chair height={house.livingRoom.chair.height} />
                </Suspense>
                <Suspense fallback={<SofaSkeleton />}>
                    <Sofa width={house.livingRoom.sofa.width} />
                </Suspense>
            </LivingRoom>
            <Suspense fallback={<CellarSkeleton />}>
                <Cellar size={house.cellar.size} />
            </Suspense>
        </>
    )
}
```

which can be simplified much by using a clever skeleton builder component.