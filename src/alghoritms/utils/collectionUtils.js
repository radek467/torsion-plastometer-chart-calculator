export function sortMapByValues(map) {
    return new Map([...map.entries()]
        .sort((a, b) => b[1] - a[1]));
}

export function incrementValue(map, key, incrementValue) {
    let incrementedValue = map.get(key) + incrementValue;
    map.set(key, incrementedValue)}