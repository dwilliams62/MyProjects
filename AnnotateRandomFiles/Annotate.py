import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cm

# Define a 2x2 matrix for demonstration
A = np.array([[1, 2], [3, 5]])

# Calculate eigenvalues and eigenvectors using NumPy
w, v = np.linalg.eig(A)

print("Eigenvalues:", w)
print("Eigenvectors:", v)

# Create a unit circle for visualization
theta = np.linspace(0, 2*np.pi, 100)
unit_circle = np.c_[np.cos(theta), np.sin(theta)]

# Scale the eigenvectors to make them visible on the unit circle
eigenvec_scaled = v * np.sqrt(np.abs(w))[:, np.newaxis]

fig, ax = plt.subplots()

# Plot the eigenvalues
ax.scatter(w.real, w.imag, c='r', marker='o', label='Eigenvalues')

# Plot the eigenvectors
ax.plot(unit_circle[:, 0], unit_circle[:, 1], 'k--', label='Unit circle')
ax.quiver(0, 0, eigenvec_scaled[0, 0], eigenvec_scaled[0, 1], color='b', angles='xy', scale_units='xy', scale=1, label='Eigenvector 1')
ax.quiver(0, 0, eigenvec_scaled[1, 0], eigenvec_scaled[1, 1], color='g', angles='xy', scale_units='xy', scale=1, label='Eigenvector 2')

ax.legend()
ax.set_xlabel('Real part')
ax.set_ylabel('Imaginary part')
ax.grid()
plt.show()