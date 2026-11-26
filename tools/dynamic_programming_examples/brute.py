def climb(n):
    if n <= 2:
        return n
    left = climb(n - 1)
    right = climb(n - 2)
    return left + right


if __name__ == "__main__":
    print(climb(9))  # 55 routes
