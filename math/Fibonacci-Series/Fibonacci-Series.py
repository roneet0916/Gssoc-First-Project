# 0,1,1,2,3,5,8,13,...

print("🔢 Fibonacci Series Generator 🔢")
print("📐 Pattern: 0, 1, 1, 2, 3, 5, 8, 13...\n")

n = int(input("➡️  Enter number of terms: "))

if n <= 0:
    print("❌ Please enter a positive number!")
elif n == 1:
    series = [0]
elif n == 2:
    series = [0, 1]
else:
    series = [0, 1]
    for i in range(2, n):
        series.append(series[i-1] + series[i-2])

print("\n✨ Fibonacci Series:")
print(" → ".join(map(str, series)))

print(f"\n📊 Sum of {len(series)} terms: {sum(series)}")