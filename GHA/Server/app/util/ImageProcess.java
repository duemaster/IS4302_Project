package util;

import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;

public class ImageProcess {
	private static final int IMG_WIDTH = 180;
	private static final int IMG_HEIGHT = 135;
	
    public static BufferedImage resizeImage(BufferedImage originalImage, int type){
	  BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT, type);
	  Graphics2D g = resizedImage.createGraphics();
	  g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
	  g.dispose();	
	  return resizedImage;
    }
	
    public static BufferedImage resizeImageWithHint(BufferedImage originalImage, int type){	
	  BufferedImage resizedImage = new BufferedImage(IMG_WIDTH, IMG_HEIGHT, type);
	  Graphics2D g = resizedImage.createGraphics();
	  g.drawImage(originalImage, 0, 0, IMG_WIDTH, IMG_HEIGHT, null);
	  g.dispose();	
	  g.setComposite(AlphaComposite.Src);

	  g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,
	  RenderingHints.VALUE_INTERPOLATION_BILINEAR);
	  g.setRenderingHint(RenderingHints.KEY_RENDERING,
	  RenderingHints.VALUE_RENDER_QUALITY);
	  g.setRenderingHint(RenderingHints.KEY_ANTIALIASING,
	  RenderingHints.VALUE_ANTIALIAS_ON);
	
	  return resizedImage;
    }
}
